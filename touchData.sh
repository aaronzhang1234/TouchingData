
#!/bin/bash
cd "$(dirname "$0")"
ng build
node app.js
exit 0



