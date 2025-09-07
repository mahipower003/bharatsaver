<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="sitemap xhtml">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap</title>
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
          }
          h1 {
            color: #222;
            font-size: 24px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #4a5568;
            color: #fff;
            font-weight: bold;
          }
          tr {
            background-color: #fff;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .alternates {
            font-size: 0.9em;
            color: #555;
          }
          .alternates a {
            margin-right: 5px;
            padding: 2px 4px;
            border: 1px solid #ccc;
            border-radius: 3px;
            white-space: nowrap;
          }
          .alternates a:hover {
            background-color: #2563eb;
            color: #fff;
            border-color: #2563eb;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>
          This is a sitemap file, meant for consumption by search engines. You can find more information about sitemaps at <a href="http://sitemaps.org">sitemaps.org</a>.
        </p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
              <th>Alternates</th>
            </tr>
          </thead>
          <tbody>
            <xsl:apply-templates select="sitemap:urlset/sitemap:url"/>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="sitemap:url">
    <tr>
      <td>
        <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
      </td>
      <td>
        <xsl:value-of select="substring(sitemap:lastmod,0,11)"/>
      </td>
      <td>
        <xsl:value-of select="sitemap:changefreq"/>
      </td>
      <td>
        <xsl:value-of select="sitemap:priority"/>
      </td>
      <td class="alternates">
        <xsl:for-each select="xhtml:link">
            <a href="{@href}"><xsl:value-of select="@hreflang"/></a>
        </xsl:for-each>
      </td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
