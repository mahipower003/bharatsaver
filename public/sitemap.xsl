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
          th { background-color: #f2f2f2; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML sitemap, used by search engines. It contains the following URLs.</p>
        <xsl:apply-templates />
      </body>
    </html>
  </xsl:template>

  <!-- Template for sitemap index files -->
  <xsl:template match="s:sitemapindex">
    <h2>Sitemap Index</h2>
    <table>
      <tr>
        <th>URL</th>
      </tr>
      <xsl:for-each select="s:sitemap">
        <tr>
          <td>
            <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <!-- Template for URL set files (individual sitemaps) -->
  <xsl:template match="s:urlset">
    <h2>URL Set</h2>
    <table>
       <tr>
        <th>URL</th>
        <th>Last Modified</th>
        <th>Change Frequency</th>
        <th>Priority</th>
      </tr>
      <xsl'for-each select="s:url">
        <tr>
          <td>
             <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
          </td>
          <td><xsl:value-of select="s:lastmod"/></td>
          <td><xsl:value-of select="s:changefreq"/></td>
          <td><xsl:value-of select="s:priority"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
