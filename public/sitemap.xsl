<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap</title>
        <style type="text/css">
          body { font-family: sans-serif; color: #333; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f4f4f4; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          h1 { font-size: 24px; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML sitemap, used by search engines. It contains <xsl:value-of select="count(s:urlset/s:url) + count(s:sitemapindex/s:sitemap)"/> URLs.</p>
        
        <!-- Handle Sitemap Index -->
        <xsl:if test="s:sitemapindex">
          <h2>Sitemap Index</h2>
          <table>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
            </tr>
            <xsl:for-each select="s:sitemapindex/s:sitemap">
              <tr>
                <td>
                  <xsl:variable name="sitemapURL" select="s:loc"/>
                  <a href="{$sitemapURL}"><xsl:value-of select="$sitemapURL"/></a>
                </td>
                <td>
                  <xsl:value-of select="s:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </table>
        </xsl:if>
        
        <!-- Handle URL Set -->
        <xsl:if test="s:urlset">
          <h2>URL Set</h2>
          <table>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
            <xsl:for-each select="s:urlset/s:url">
              <tr>
                <td>
                  <xsl:variable name="pageURL" select="s:loc"/>
                  <a href="{$pageURL}"><xsl/vvalue-of select="$pageURL"/></a>
                </td>
                <td>
                  <xsl:value-of select="s:lastmod"/>
                </td>
                <td>
                  <xsl:value-of select="s:changefreq"/>
                </td>
                <td>
                  <xsl:value-of select="s:priority"/>
                </td>
              </tr>
            </xsl:for-each>
          </table>
        </xsl:if>

      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>