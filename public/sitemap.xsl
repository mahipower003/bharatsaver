<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="s">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
  <html>
    <head>
      <title>XML Sitemap</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: #333; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top;}
        th { background-color: #f2f2f2; font-weight: bold; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
        h1 { font-size: 24px; }
        .alternates-list { margin: 0; padding: 0; list-style-type: none; }
        .alternates-list li { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <h1>XML Sitemap</h1>
      <p>This sitemap is intended for search engine crawlers. The links below are for human browsing.</p>
      <table>
        <thead>
          <tr>
            <th>URL Location</th>
            <th>Last Modified</th>
            <th>Change Frequency</th>
            <th>Priority</th>
            <th>Alternate Language Links</th>
          </tr>
        </thead>
        <tbody>
          <xsl:apply-templates select="s:urlset/s:url"/>
        </tbody>
      </table>
    </body>
  </html>
</xsl:template>

<xsl:template match="s:url">
  <tr>
    <td>
      <a>
        <xsl:attribute name="href">
          <xsl:value-of select="s:loc"/>
        </xsl:attribute>
        <xsl:value-of select="s:loc"/>
      </a>
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
    <td>
      <ul class="alternates-list">
        <xsl:for-each select="xhtml:link">
          <li>
            <b><xsl:value-of select="@hreflang"/>:</b>
            <a style="margin-left: 5px;">
              <xsl:attribute name="href">
                <xsl:value-of select="@href"/>
              </xsl:attribute>
              <xsl:value-of select="@href"/>
            </a>
          </li>
        </xsl:for-each>
      </ul>
    </td>
  </tr>
</xsl:template>

</xsl:stylesheet>
