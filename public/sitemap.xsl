<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                exclude-result-prefixes="s">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
  <html>
    <head>
      <title>XML Sitemap</title>
      <style>
        body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; color: #333; }
        #sitemap { max-width: 900px; margin: 2rem auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div id="sitemap">
        <h1>XML Sitemap</h1>
        <p>This is an XML sitemap, typically used by search engines to index a website's content.</p>
        <xsl:if test="count(s:sitemapindex/s:sitemap) > 0">
          <h2>Sitemap Index</h2>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:sitemapindex/s:sitemap">
                <tr>
                  <td>
                    <xsl:variable name="loc">
                      <xsl:value-of select="s:loc"/>
                    </xsl:variable>
                    <a href="{$loc}">
                      <xsl:value-of select="s:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="s:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </xsl:if>
        <xsl:if test="count(s:urlset/s:url) > 0">
          <h2>URL Set</h2>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Priority</th>
                <th>Change Frequency</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td>
                    <xsl:variable name="loc">
                      <xsl:value-of select="s:loc"/>
                    </xsl:variable>
                    <a href="{$loc}">
                      <xsl:value-of select="s:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="s:lastmod"/>
                  </td>
                   <td>
                    <xsl:value-of select="s:priority"/>
                  </td>
                   <td>
                    <xsl:value-of select="s:changefreq"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </xsl:if>
      </div>
    </body>
  </html>
</xsl:template>
</xsl:stylesheet>
