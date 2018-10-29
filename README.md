# Bodhi UI

# Get Started

## Requirements
Node version greater than 8.6.0
Yarn

## Steps
1. Installing Packages & Dependencies:
  `yarn`
  Yarn will download all the necessary packages and dependencies in to node_modules folder.
2. Run `npm install`
3. Start the app
  `yarn start`
  After the compiled process completed successfully, it will show success commands & redirect to the http://localhost:3000/ of browser where you will find the login screen of the app.
4. To create an Optimized Product Build of the app, you need to run a build command in you terminal at app root.
  `yarn build`

# Development

## Prepare Database data

### Importing 
1. use `which mongo` find mongo install directory, in which you will also find a mongorestore executable.

2. `mongorestore --db <dbname> topics.json`
  bodhi-ui use "bodhiapi" as <dbname>, if you use other name you need to go to bodhi-graphql/src/db/index.js to update it.
  This command will create a table with file name 'topics' in database <dbname>.

### Exporting
1. Use `which mongo` find mongo install directory, in which you will also find a mongodump executable.

2.`mongodump --db bodhiapi --collection <colleciton_name> --out - > <output_path>/<filename>.bson`
Note that filename is best to be same as collection name for the ease of importing.

## Set up Apache server
1. Create apache virtual host config from template
`sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf`
2. Open the new file in your editor with root privileges:
`sudo vim /etc/apache2/sites-available/example.com.conf`
3. The file will look something like this (I've removed the comments here to make the file more approachable):
```<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
4. Update document root
`DocumentRoot /var/www/example.com/public_html`
5. Save and close the file.

6. Enable the New Virtual Host Files using a2ensite tool 
`sudo a2ensite example.com.conf`

7. Restart apache server
`sudo service apache2 restart`


## Coding

### Javascript formatter
We use eslint to validate and format javascript code.

npm run lint:fix <path/to/code>
e.g. npm run lint:fix ./app/components/ImageButton/

The actually command run is eslint --fix -- "<path/to/code>". Some basic rules can be auto-fixed and the eslint --fix command will print out non-fixables which need mannual repair. 

The complete rule settings are in
http://eslint.org/docs/rules/

## Responsive Layout

There are 2 ways to achieve responsive layout
1. Using React layout in js, for example use medium={4} to set column width and showOnlyFor={Breakpoints.SMALL} to set visible option on different devices
  <Row>
    <Column small={6} medium={4}>
      <Callout color={Colors.SECONDARY}>
        <Block showOnlyFor={Breakpoints.SMALL}>On a small screen, I have gutters!</Block>
        <Block showOnlyFor={Breakpoints.MEDIUM}>On a medium screen, I have gutters!</Block>
        <Block showFor={Breakpoints.LARGE}>On a large screen, I have no gutters!</Block>
      </Callout>
    </Column>
   </Row>

 2. Using Sass mixin defined in app/containers/app/index.scss. Media query variables are defined with the same value as those in Foundation. Usage example:
    .some-class{
     @include breakpoint(small) {
        height: 20%;
    }
     @include breakpoint(medium) {
        height: 40%;
    }
     }

## Localization
npm run extract-intl (not tested yet)

# Known Bugs


1. User Montserrat font
