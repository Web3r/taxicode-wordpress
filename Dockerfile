FROM  ewc2020/tc-wordpress-base:latest

LABEL com.taxicode.version="0.0.1-beta"
LABEL com.taxicode.target-env="wordpress-plugin"
LABEL com.taxicode.target-env.version="latest"

RUN set -ex \
    git clone --branch docker-testing https://github.com/Web3r/taxicode-wordpress.git /usr/src/wordpress/wp-content/plugins/taxicode \
    cd /usr/src/wordpress/wp-content/plugins/taxicode \
    npm install \
    npm audit fix

VOLUME /var/www/html/wp-content/plugins/taxicode
