FROM wordpress:latest

LABEL com.taxicode.version="0.0.1-beta"
LABEL com.taxicode.target-env="wordpress-plugin"
LABEL com.taxicode.target-env.version="latest"

RUN  mkdir -p ./wp-content/plugins/taxicode
COPY . ./wp-content/plugins/taxicode/.
RUN cd wp-content/plugins/taxicode && npm install
