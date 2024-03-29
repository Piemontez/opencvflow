/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';
import checkNodeEnv from '../scripts/check-node-env';
import deleteSourceMaps from '../scripts/delete-source-maps';
import { version } from '../../package.json';

checkNodeEnv('production');
deleteSourceMaps();

export default merge(baseConfig, {
  mode: 'production',

  target: 'web',

  entry: [
    'core-js',
    'regenerator-runtime/runtime',
    path.join(webpackPaths.srcRendererPath, 'index.tsx'),
  ],

  output: {
    path: webpackPaths.distWebviewPath,
    publicPath: './',
    filename: `[name].[contenthash].js`,
    library: {
      name: 'opencvflow',
      type: 'umd',
    },
  },

  /*experiments: {
    outputModule: true,
  },*/

  module: {
    rules: [
      {
        test: /\.s?(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      //Font Loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
      // Expose loader
      {
        test: require.resolve('opencv-ts'),
        loader: 'expose-loader',
        options: {
          exposes: ['cv'],
        },
      },
    ],
  },

  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_classnames: true,
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        monacoeditor: {
          test: /[\\/]node_modules[\\/]monaco-editor[\\/]/,
          name: 'monacoeditor',
          priority: -10,
          reuseExistingChunk: true,
          chunks: 'all',
        },
        opencvts: {
          test: /[\\/]node_modules[\\/]opencv-ts[\\/]/,
          name: 'opencvts',
          priority: -20,
          reuseExistingChunk: true,
          chunks: 'all',
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -30,
          reuseExistingChunk: true,
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          priority: -40,
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      new RegExp(`(.*)${webpackPaths.moduleNameReplace}(\.*)`),
      function (resource) {
        resource.request = resource.request.replace(
          webpackPaths.moduleNameReplace,
          webpackPaths.webviewModuleName
        );
      }
    ),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
    }),

    new MiniCssExtractPlugin({
      filename: '[name].style.css',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${webpackPaths.srcAssetsPath}/imgs/*`,
          to({ context, absoluteFilename }) {
            const toPath = path.relative(context, absoluteFilename);
            const renderPath = path.relative(
              context,
              webpackPaths.srcRendererPath
            );
            return `./${toPath.replace(renderPath, '')}`;
          },
          info: {
            minimized: true,
          },
        },
      ],
    }),

    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: path.join(webpackPaths.srcRendererPath, 'index.webview.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: true,
      isDevelopment: 'production',
    }),
  ],
});
