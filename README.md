
<img align="right" src="favicon/favicon-128.png">


# better-kickbase
#### Manage dein Team effizienter mit der Browser Erweiterung better-kickbase!


## Funktionen

### Kompakteres Layout
Durch das kompaktere Layout siehst du mehr Informationen auf einen Blick!
### Export Funktionen
Lade eine Liste deiner Spieler, deren Marktwerten und vorliegenden Angeboten als `.csv`-Datei herunter.
Alternativ kannst du 
### Re-List
Schlechte Angebote nerven! Hole mit einem Klick neue Angebote für alle Spieler ein, bei denen das Angebot des Transfermarkts unter dem Marktwert liegt.
### Kickbase Benachrichtigung blockieren
Schluss mit dem Benachrichtigungs-Dschungel! Mit `better-kickbase` kannst du Benachrichtigungen ausblenden.

## Installation
In Kürze wird die Erweiterung im Chrome Web Store verfügbar sein, bis dahin kann die Erweiterung ausschließlich im Entwicklermodus installiert werden.

### Installation im Entwicklermodus
1. Zur Erweiterungsseite navigieren und den Entwicklermodus aktivieren
2. `better-kb.zip` [hier](https://github.com/FelixSchuSi/better-kickbase/releases) aus dem letzten Release herunterladen
3. Per drag-and-drop die Zip Datei als Erweiterung installieren


## Browser Unterstützung
| Browser | Unterstützt?    |
|---------|--------------|
| Chrome  | ✅            |
| Edge    | ✅            |
| Brave   | ✅            |
| Opera   | ✅            |
| Firefox | ❌(in Kürze!) |
| Safari  | ❌            |

# Build the extension
Node >= v14.12.0 and npm >= 6.14.8 is needed to build this extension.
You can build this extension yourself in just a few steps:

1. Clone this repo: `git clone https://github.com/FelixSchuSi/better-kickbase.git`
2. Install dependencies from npm: `npm i`
3. Build: `npm run build`
4. The newely created `dist` directory contains all the files you need to manually install the extension!
