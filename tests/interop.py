"""Gegenprüfung mit der echten SeedSigner-Software (Python) und embit.

Wird von tests/interop.test.mjs aufgerufen: liest einen JSON-Befehl von stdin,
schreibt das Ergebnis als JSON nach stdout. Nur für Tests, nicht Teil der App.
"""
import glob
import json
import os
import sys
import types

# Pfad zum SeedSigner-Quellcode (git clone https://github.com/SeedSigner/seedsigner) und zur
# libsecp256k1, die embit mitliefert (für python-bitcointx).
SEEDSIGNER_SRC = os.environ.get('SEEDSIGNER_SRC', os.path.join(os.path.dirname(__file__), '..', 'ext', 'seedsigner', 'src'))
LIBSECP = os.environ.get('LIBSECP') or next(iter(glob.glob('/usr/local/lib/python3*/*-packages/embit/util/prebuilt/libsecp256k1_linux_x86_64.so')), None)
sys.path.insert(0, SEEDSIGNER_SRC)

# pyzbar (Kamera-Bibliothek) wird für die Tests nicht gebraucht: Platzhalter einsetzen.
pz = types.ModuleType('pyzbar')
pz.pyzbar = types.ModuleType('pyzbar.pyzbar')
pz.pyzbar.ZBarSymbol = None
sys.modules['pyzbar'] = pz
sys.modules['pyzbar.pyzbar'] = pz.pyzbar

import bitcointx  # noqa: E402
bitcointx.set_custom_secp256k1_path(LIBSECP)

from embit import bip32, bip39, psbt as epsbt  # noqa: E402
from embit.descriptor import Descriptor  # noqa: E402
from embit.descriptor.checksum import add_checksum  # noqa: E402
from embit.networks import NETWORKS  # noqa: E402
from seedsigner.helpers.ur2.ur import UR  # noqa: E402
from seedsigner.helpers.ur2.ur_encoder import UREncoder  # noqa: E402
from seedsigner.models.decode_qr import DecodeQR, DecodeQRStatus  # noqa: E402
from seedsigner.models.psbt_parser import PSBTParser  # noqa: E402
from seedsigner.models.seed import Seed  # noqa: E402
from seedsigner.models.settings import SettingsConstants  # noqa: E402
from urtypes.crypto import PSBT as UR_PSBT, Account, HDKey, Output, Keypath, PathComponent, SCRIPT_EXPRESSION_TAG_MAP, CoinInfo  # noqa: E402


def net_of(name):
    return NETWORKS['main'] if name == 'main' else NETWORKS['test']


def ss_net(name):
    return SettingsConstants.MAINNET if name == 'main' else SettingsConstants.TESTNET


def cmd_setup(a):
    """Schlüssel wie SeedSigner exportieren: Text und UR crypto-account."""
    net = net_of(a['network'])
    coin = 0 if a['network'] == 'main' else 1
    path = f"m/48h/{coin}h/0h/2h"
    out = []
    for words in a['mnemonics']:
        root = bip32.HDKey.from_seed(bip39.mnemonic_to_seed(words), version=net['xprv'])
        fp = root.child(0).fingerprint.hex()
        xpub = root.derive(path).to_public()
        text = f"[{fp}{path[1:]}]{xpub.to_string(version=net['xpub'])}"
        # Nachbau von SeedSigner UrXpubQrEncoder
        comps = [PathComponent(48, True), PathComponent(coin, True), PathComponent(0, True), PathComponent(2, True)]
        origin = Keypath(comps, root.my_fingerprint, 4)
        use_info = None if a['network'] == 'main' else CoinInfo(type=None, network=1)
        hdk = HDKey({'key': xpub.key.serialize(), 'chain_code': xpub.chain_code, 'origin': origin,
                     'parent_fingerprint': xpub.fingerprint, 'use_info': use_info})
        acc = Account(root.my_fingerprint, [Output([SCRIPT_EXPRESSION_TAG_MAP[401]], hdk)])
        enc = UREncoder(UR('crypto-account', acc.to_cbor()), max_fragment_len=60)
        parts = [enc.next_part() for _ in range(enc.fountain_encoder.seq_len() * 2)]
        out.append({'fingerprint': fp, 'xpub': xpub.to_string(version=net['xpub']), 'text': text, 'ur': parts})
    return out


def cmd_addresses(a):
    """Adressen und Prüfsumme mit embit aus dem Descriptor berechnen."""
    net = net_of(a['network'])
    d = Descriptor.from_string(a['descriptor'])
    return {
        'receive': [d.derive(i, branch_index=0).address(net) for i in range(a['count'])],
        'change': [d.derive(i, branch_index=1).address(net) for i in range(a['count'])],
        'checksum': add_checksum(a['descriptor'].split('#')[0]).split('#')[1],
    }


def feed(parts):
    dec = DecodeQR()
    for p in parts:
        st = dec.add_data(p)
        if st == DecodeQRStatus.COMPLETE:
            return dec
        if st == DecodeQRStatus.INVALID:
            raise Exception('SeedSigner: QR ungültig: ' + p[:40])
    raise Exception('SeedSigner: nicht vollständig')


def cmd_setupfile(a):
    """Unsere Wallet-QR-Teile wie SeedSigner einlesen → Descriptor → Adressen."""
    dec = feed(a['parts'])
    desc_str = dec.get_wallet_descriptor()
    net = net_of(a['network'])
    d = Descriptor.from_string(desc_str)
    return {'qr_type': dec.qr_type, 'descriptor': desc_str,
            'receive0': d.derive(0, branch_index=0).address(net),
            'change0': d.derive(0, branch_index=1).address(net)}


def cmd_sign(a):
    """PSBT-QR wie SeedSigner scannen, prüfen, signieren, als UR zurückgeben."""
    dec = feed(a['parts'])
    p = dec.get_psbt()
    seed = Seed(a['mnemonic'].split())
    parser = PSBTParser(p, seed, network=ss_net(a['network']))
    info = {'spend': parser.spend_amount, 'change': parser.change_amount, 'fee': parser.fee_amount,
            'destinations': parser.destination_addresses, 'num_change': len(parser.change_data)}
    if a.get('descriptor'):
        d = Descriptor.from_string(a['descriptor'])
        info['change_verified'] = [parser.verify_multisig_output(d, i) for i in range(len(parser.change_data))]
    sig_before = PSBTParser.sig_count(p)
    p.sign_with(parser.root)
    trimmed = PSBTParser.trim(p)
    info['signed'] = PSBTParser.sig_count(trimmed) > sig_before
    enc = UREncoder(UR('crypto-psbt', UR_PSBT(trimmed.serialize()).to_cbor()), max_fragment_len=80)
    info['parts'] = [enc.next_part() for _ in range(enc.fountain_encoder.seq_len() * 2)]
    return info


def cmd_verify(a):
    """Fertige Transaktion mit einem unabhängigen Skript-Interpreter prüfen (python-bitcointx)."""
    from bitcointx.core import CTransaction, CTxOut
    from bitcointx.core.script import CScript
    from bitcointx.core.scripteval import VerifyScript, SCRIPT_VERIFY_P2SH, SCRIPT_VERIFY_WITNESS, SCRIPT_VERIFY_STRICTENC, SCRIPT_VERIFY_DERSIG, SCRIPT_VERIFY_LOW_S, SCRIPT_VERIFY_NULLDUMMY, SCRIPT_VERIFY_CLEANSTACK
    tx = CTransaction.deserialize(bytes.fromhex(a['tx']))
    flags = {SCRIPT_VERIFY_P2SH, SCRIPT_VERIFY_WITNESS, SCRIPT_VERIFY_STRICTENC, SCRIPT_VERIFY_DERSIG,
             SCRIPT_VERIFY_LOW_S, SCRIPT_VERIFY_NULLDUMMY, SCRIPT_VERIFY_CLEANSTACK}
    for i, prev in enumerate(a['prevouts']):
        spk = CScript(bytes.fromhex(prev['script']))
        VerifyScript(tx.vin[i].scriptSig, spk, tx, i, flags=flags, amount=prev['amount'],
                     witness=tx.wit.vtxinwit[i].scriptWitness)
    return {'ok': True, 'txid': tx.GetTxid()[::-1].hex(), 'vsize': tx.get_virtual_size()}


if __name__ == '__main__':
    req = json.loads(sys.stdin.read())
    res = globals()['cmd_' + req['cmd']](req)
    print(json.dumps(res))
