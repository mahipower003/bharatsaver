<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/X1SL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap</title>
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            color: #333;
            margin: 2rem;
          }
          h1 {
            font-size: 24px;
            font-weight: 600;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            font-size: 14px;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .alternates {
            margin-top: 10px;
          }
          .alternates ul {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
          }
          .alternates li {
            font-size: 12px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML sitemap, meant for consumption by search engines.</p>
        <p>You can find more information about XML sitemaps at <a href="http://sitemaps.org">sitemaps.org</a>.</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Alternates</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:apply-templates select="s:urlset/s:url"/>
          </tbody>
        </table>
      </body>
    </html>
  </xslple:template>

  <xsl:template match="s:url">
    <tr>
      <td>
        <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
      </td>
      <td>
        <div class="alternates">
          <ul>
            <xsl:for-each select="xhtml:link">
              <li>
                <xsl:value-of select="@hreflang"/>: <a href="{@href}"><xsl:value-of select="@href"/></a>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </td>
      <td><xsl:value-of select="s:lastmod"/></td>
      <td><xsl:value-of select="s:changefreq"/></td>
      <td><xsl:value-of select="s:priority"/></td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
