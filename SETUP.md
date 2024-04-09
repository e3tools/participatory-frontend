## To build .apk locally

```bash
npx eas build --platform android --profile preview --local
or
npx eas build --clear-cache --platform android --profile preview --local
```

- Set JAVA_HOME in the current terminal window. if it does not exist

```bash
export JAVA_HOME=/snap/android-studio/151/jbr
```

- To export JAVA_HOME permanently, edit ~/.bashrc file and an entry at the end

- If build fails, check dependencies using:

```bash
npx expo install --check
```

## Installing Frappe 15 on Ubuntu 22.04

- https://github.com/kalungia/How-to-Install-ERPNext-on-Ubuntu-22.04-LTS