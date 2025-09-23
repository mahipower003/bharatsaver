<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="html" indent="yes" encoding="UTF-8"/>
<xsl:template match="/">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <title>XML Sitemap</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <style type="text/css">
        body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 8px 12px; border: 1px solid #ddd; }
        th { background-color: #f4f4f4; text-align: left; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>XML Sitemap</h1>
      <p>This is an XML sitemap, meant for consumption by search engines.</p>
      <p>You can find more information about XML sitemaps on <a href="http://sitemaps.org">sitemaps.org</a>.</p>
      <xsl:apply-templates/>
    </body>
  </html>
</xsl:template>

<xsl:template match="sitemap:sitemapindex">
  <h2>Sitemap Index</h2>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Last Modified</th>
      </tr>
    </thead>
    <tbody>
      <xsl:for-each select="sitemap:sitemap">
        <tr>
          <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
          <td><xsl:value-of select="sitemap:lastmod"/></td>
        </tr>
      </xsl:for-each>
    </tbody>
  </table>
</xsl:template>

<xsl:template match="sitemap:urlset">
  <h2>URL Set</h2>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Last Modified</th>
      </tr>
    </thead>
    <tbody>
      <xsl:for-each select="sitemap:url">
        <tr>
          <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
          <td><xsl:value-of select="sitemap:lastmod"/></td>
        </tr>
      </xsl:for-each>
    </tbody>
  </table>
</xsl:template>

</xsl:stylesheet>
