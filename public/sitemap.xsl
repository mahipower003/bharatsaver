<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html>
            <head>
                <title>XML Sitemap</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 16px; color: #333; }
                    #sitemap { border-collapse: collapse; width: 100%; max-width: 900px; margin: 2rem auto; }
                    #sitemap th, #sitemap td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    #sitemap th { padding-top: 14px; padding-bottom: 14px; background-color: #f2f2f2; color: #333; }
                    #sitemap tr:nth-child(even) { background-color: #f9f9f9; }
                    #sitemap tr:hover { background-color: #f1f1f1; }
                    a { color: #007bff; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    h1, p { text-align: center; max-width: 900px; margin-left: auto; margin-right: auto;}
                </style>
            </head>
            <body>
                <h1>XML Sitemap</h1>
                <p>This is an XML sitemap, typically used by search engines to index a website's content.</p>
                <table id="sitemap">
                    <thead>
                        <tr>
                            <th>URL</th>
                            <xsl:if test="count(//sitemap:lastmod) > 0">
                                <th>Last Modified</th>
                            </xsl:if>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- For Sitemap Index -->
                        <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                            <tr>
                                <td>
                                    <xsl:variable name="loc" select="sitemap:loc"/>
                                    <a href="{$loc}"><xsl:value-of select="$loc"/></a>
                                </td>
                                 <xsl:if test="count(//sitemap:lastmod) > 0">
                                    <td>
                                        <xsl:value-of select="sitemap:lastmod"/>
                                    </td>
                                </xsl:if>
                            </tr>
                        </xsl:for-each>

                        <!-- For URL Set -->
                        <xsl:for-each select="sitemap:urlset/sitemap:url">
                             <tr>
                                <td>
                                    <xsl:variable name="loc" select="sitemap:loc"/>
                                    <a href="{$loc}"><xsl:value-of select="$loc"/></a>
                                </td>
                                 <xsl:if test="count(//sitemap:lastmod) > 0">
                                    <td>
                                        <xsl:value-of select="sitemap:lastmod"/>
                                    </td>
                                </xsl:if>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>