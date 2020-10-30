FROM tc-dev-wordpress:latest

LABEL com.taxicode.version="0.0.1-beta"
LABEL com.taxicode.target-env="wordpress-plugin"
LABEL com.taxicode.target-env.version="latest"

RUN git clone --branch docker-testing https://github.com/Web3r/taxicode-wordpress.git /var/www/html/wp-content/plugins/taxicode
COPY package*.json "/var/www/html/wp-content/plugins/taxicode/"
RUN cd "/var/www/html/wp-content/plugins/taxicode" && npm install && npm audit fix && npm update

VOLUME /var/www/html/wp-content/plugins/taxicode

