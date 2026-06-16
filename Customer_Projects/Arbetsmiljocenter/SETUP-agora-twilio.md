# Koppla Twilio → Agora (för riktiga telefonsamtal)

> Den "Add Phone Number"-rutan i Agora Console kräver en **Twilio SIP-trunk** först.
> Fyll INTE i Agora-formen förrän du gjort steg 1–2 nedan.

## Steg 1 — Twilio: konto + nummer
1. Skapa konto på twilio.com.
2. Köp ett telefonnummer (svenskt om möjligt, annars valfritt för test): **Phone Numbers → Buy a number**.

## Steg 2 — Twilio: skapa Elastic SIP Trunk
1. **Elastic SIP Trunking → Trunks → Create new SIP Trunk**.
2. Notera **Termination SIP URI** (t.ex. `dittnamn.pstn.twilio.com`) — detta är "SIP Trunk Address".
3. Under **Termination** → skapa **Credential List** (användarnamn + lösenord) → koppla till trunken.
4. Koppla ditt köpta nummer till trunken (Origination/Number assignment).

## Steg 3 — Agora Console: fyll i "Add Phone Number"
| Fält | Vad du skriver |
|---|---|
| Phone Number | Ditt Twilio-nummer (E.164, t.ex. +46…) |
| Vendor | SIP Trunk |
| Display Name | t.ex. "Arbetsmiljöcenter test" |
| SIP Trunk Address | Twilio Termination SIP URI (från steg 2.2) |
| SIP Trunk Username | Från Credential List (steg 2.3) |
| SIP Trunk Password | Från Credential List |
| Transport Protocol | **TLS** (säkrast; välj TCP om Twilio-trunken kräver det) |

## Steg 4 — Aktivera outbound-PSTN-beta (om låst)
Agoras telefoni är beta → om utgående samtal inte funkar: **mejla Agora Support** och be dem aktivera
outbound telephony på ditt projekt.

## Viktigt
- Numret kommer från **Twilio**, inte Agora. Agora "lånar" det via trunken.
- Detta behövs bara för **riktiga telefonsamtal**. Digitala samtal i webbläsaren (Glenn klickar en länk)
  behöver INTE detta.
- Inget e-SIM. Allt är VoIP/SIP.
