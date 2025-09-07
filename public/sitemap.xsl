<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="s xhtml">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>XML Sitemap</title>
                <style type="text/css">
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                        color: #333;
                        line-height: 1.6;
                    }
                    #sitemap {
                        width: 95%;
                        margin: 20px auto;
                        border-collapse: collapse;
                        border: 1px solid #ccc;
                    }
                    #sitemap th, #sitemap td {
                        padding: 10px 15px;
                        text-align: left;
                    }
                    #sitemap th {
                        background-color: #f2f2f2;
                        border-bottom: 2px solid #ccc;
                    }
                    #sitemap tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    #sitemap tr:hover {
                        background-color: #f1f1f1;
                    }
                    a {
                        color: #0073aa;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .alternates {
                        font-size: 0.9em;
                        list-style-type: none;
                        padding-left: 0;
                    }
                     .alternates li {
                        margin-top: 4px;
                    }
                </style>
            </head>
            <body>
                <div id="content">
                    <h1>XML Sitemap</h1>
                    <p>This is an XML sitemap, intended for consumption by search engines.</p>
                    <p>You can find more information about XML sitemaps at <a href="http://sitemaps.org">sitemaps.org</a>.</p>
                    <table id="sitemap">
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Alternates (hreflang)</th>
                                <th>Priority</th>
                                <th>Change Frequency</th>
                                <th>Last Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="s:urlset/s:url">
                                <tr>
                                    <td>
                                        <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                                    </td>
                                    <td>
                                        <ul class="alternates">
                                            <xsl:for-each select="xhtml:link">
                                                <li>
                                                    <b><xsl:value-of select="@hreflang"/>:</b> <a href="{@href}"><xsl:value-of select="@href"/></a>
                                                </li>
                                            </xsl:for-each>
                                        </ul>
                                    </td>
                                    <td>
                                        <xsl:value-of select="s:priority"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="s:changefreq"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="substring(s:lastmod,0,11)"/>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
