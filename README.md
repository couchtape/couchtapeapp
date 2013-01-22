# couchtape

## Installation

Everything is now stored in Process. So no database is needed anymore.

### Install the required Node_Modules with npm:

```
$ npm install
```

## Build the app
```
$ grunt
```

## Configuration and Starting the couchtape

### The manual way

set the environment variables to match your configuration:
- APPLICATION_ID
- APPLICATION_SECRET
- APPLICATION_OAUTH_REDIRECT

```
$ node app
```

### Using the <code>couchtape.sh</code>

Copy the default startscript:

```
$ cp bin/couchtape.sh.default bin/couchtape.sh
```

modify it for your configuration needs and make it executable:

```
$ chmod +x bin/couchtape.sh
```

then simpy run the App with

```
$ bin/couchtape.sh
```

## Finally

Open your browser with <code>http://localhost:3000</code> and enjoy the experience.