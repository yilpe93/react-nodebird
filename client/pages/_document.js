import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getIntialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...orios} />),
        });

      const intialProps = await Document.getInitialProps(ctx);

      return {
        ...intialProps,
        styles: (
          <>
            {intialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (err) {
      console.error(err);
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* 
            위 ServerSide는 IE에서 돌아가지 않으며,
            이를 해결하기 위해 무거운 babel-polyfill 보단
            https://polyfill.io/v3/url-builder/ 에서 Libray를 필요 부분만 하여 가볍게 추가하여 사용
           */}
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
