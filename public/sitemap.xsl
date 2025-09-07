<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap</title>
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            background-color: #f8f9fa;
          }
          #sitemap {
            width: 95%;
            margin: 20px auto;
            border-collapse: collapse;
            border: 1px solid #ccc;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          #sitemap th, #sitemap td {
            padding: 12px 15px;
            text-align: left;
          }
          #sitemap thead {
            background-color: #007bff;
            color: #fff;
          }
          #sitemap th {
            font-weight: 600;
          }
          #sitemap tbody tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          #sitemap tbody tr:hover {
            background-color: #e9ecef;
          }
          #sitemap a {
            color: #007bff;
            text-decoration: none;
          }
          #sitemap a:hover {
            text-decoration: underline;
          }
          .container {
            padding: 20px;
          }
          h1 {
            color: #343a40;
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemap</h1>
          <p>This is an XML sitemap, intended for consumption by search engines.</p>
          <p>You can find more information about XML sitemaps on <a href="http://sitemaps.org">sitemaps.org</a>.</p>
        </div>
        <table id="sitemap">
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="s:urlset/s:url">
              <tr>
                <td>
                  <xsl:variable name="loc" select="s:loc"/>
                  <a href="{$loc}"><xsl:value-of select="$loc"/></a>
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
          </tbody>
        </table>
      </body>
    </html>
  </xsl/template>
</xsl:stylesheet>
