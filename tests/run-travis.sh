#!/bin/bash

if [ "$WP_TRAVISCI" == "phpunit" ]; then

		echo "Running phpunit with:"
		echo " - WordPress mode:    $WP_MODE"
		echo " - WordPress branch:  $WP_BRANCH"

		# WP_BRANCH = master | latest | previous
		cd /tmp/wordpress-$WP_BRANCH/src/wp-content/plugins/$PLUGIN_SLUG

		# Construct phpunit command
		# WP_MODE = single | multi
		if [ "$WP_MODE" == "multi" ]; then
			# WP Multi sites
			$RUN_PHPUNIT="WP_MULTISITE=1 phpunit -c tests/php.multisite.xml"
		else
			# WP Single sites
			$RUN_PHPUNIT=phpunit
		fi

		# Run phpunit command
		if [ ! $RUN_PHPUNIT ]; then
			exit 1
		fi

else

		gem install sass
		gem install compass
		yarn

		if [ ! $WP_TRAVISCI]; then
				exit 1
		fi
fi

exit 0
