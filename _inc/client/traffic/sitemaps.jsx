/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { translate as __ } from 'i18n-calypso';
import ExternalLink from 'components/external-link';
import get from 'lodash/get';
import analytics from 'lib/analytics';

/**
 * Internal dependencies
 */
import {
	FormFieldset
} from 'components/forms';
import { ModuleSettingsForm as moduleSettingsForm } from 'components/module-settings/module-settings-form';
import { ModuleToggle } from 'components/module-toggle';
import SettingsCard from 'components/settings-card';
import SettingsGroup from 'components/settings-group';
import { getSiteAdminUrl, isSiteVisibleToSearchEngines } from 'state/initial-state';

export class Sitemaps extends React.Component {
	trackSitemapUrl = () => {
		analytics.tracks.recordJetpackClick( 'sitemap-url-link' );
	};

	trackSitemapNewsUrl = () => {
		analytics.tracks.recordJetpackClick( 'sitemap-news-url-link' );
	};

	render() {
		const sitemaps = this.props.getModule( 'sitemaps' ),
			sitemap_url = get( sitemaps, [ 'extra', 'sitemap_url' ], '' ),
			news_sitemap_url = get( sitemaps, [ 'extra', 'news_sitemap_url' ], '' );

		const searchEngineVisibilityClasses = classNames( {
			'jp-form-setting-explanation': true,
			'is-warning': ! this.props.isSiteVisibleToSearchEngines && this.props.getOptionValue( 'sitemaps' )
		} );

		return (
			<SettingsCard
				{ ...this.props }
				module="sitemaps"
				hideButton
			>
				<SettingsGroup
					hasChild
					module={ { module: 'sitemaps' } }
					support={ {
						link: 'https://jetpack.com/support/sitemaps/',
					} }
				>
					<p>
						{ __(
							'Sitemaps are files that search engines like Google or Bing use ' +
								'to index your website and can help get you discovered and ' +
								'rank higher. When this feature is enabled, Jetpack will create ' +
								'these files for you and update them automatically whenever you ' +
								'add new content to your site.'
							) }
					</p>
					<ModuleToggle
						slug="sitemaps"
						compact
						activated={ this.props.getOptionValue( 'sitemaps' ) }
						toggling={ this.props.isSavingAnyOption( 'sitemaps' ) }
						toggleModule={ this.props.toggleModuleNow }
					>
						{ __( 'Generate XML sitemaps' ) }
					</ModuleToggle>
					{
						this.props.isSiteVisibleToSearchEngines
							? this.props.getOptionValue( 'sitemaps' ) && (
								<FormFieldset>
									<p className="jp-form-setting-explanation">
										Your sitemap is automatically sent to all major search engines for indexing.
										<br />
										<ExternalLink
											onClick={ this.trackSitemapUrl }
											icon={ true }
											target="_blank"
											rel="noopener noreferrer"
											href={ sitemap_url }
										>
											{ sitemap_url }
										</ExternalLink>
										<br />
										<ExternalLink
											onClick={ this.trackSitemapNewsUrl }
											icon={ true }
											target="_blank"
											rel="noopener noreferrer"
											href={ news_sitemap_url }
										>
											{ news_sitemap_url }
										</ExternalLink>
									</p>
								</FormFieldset>
							)
							: (
								<FormFieldset>
										<p className={ searchEngineVisibilityClasses }>
											{
												__(
													'Your site is not currently accessible to search engines. ' +
														'You might have "Search Engine Visibility" disabled in ' +
														'your {{a}}Reading Settings{{/a}}.',
													{
														components: {
															a: <a href={ this.props.siteAdminUrl + 'options-reading.php' } />
														}
													}
												)
											}
										</p>
								</FormFieldset>
							)
					}
				</SettingsGroup>
			</SettingsCard>
		);
	}
}

export default connect(
	state => {
		return {
			isSiteVisibleToSearchEngines: isSiteVisibleToSearchEngines( state ),
			siteAdminUrl: getSiteAdminUrl( state )
		};
	}
)( moduleSettingsForm( Sitemaps ) );
