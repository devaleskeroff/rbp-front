const path = require("path");
// const TerserPlugin = require("terser-webpack-plugin");
const { DefinePlugin } = require("webpack");
const rewireSvgSpriteLoader = require("react-app-rewired-svg-sprite-loader");
// const webpack = require("react-app-rewired");
// const { devServer } = require('react-app-rewired/config-overrides')

module.exports = {
   webpack: function override(config, env) {
      // config.optimization = {
      //    minimize: true,
      //    minimizer: [
      //       new TerserPlugin({
      //          terserOptions: {
      //             myCustomOption: true,
      //          },
      //          // Can be async
      //          minify: (file, sourceMap, minimizerOptions) => {
      //             // The `minimizerOptions` option contains option from the `terserOptions` option
      //             // You can use `minimizerOptions.myCustomOption`
      //             const extractedComments = [];
      //
      //             // Custom logic for extract comments
      //
      //             const { map, code } = require("uglify-js") // Or require('./path/to/uglify-module')
      //                .minify(file, {
      //                   /* Your options for minification */
      //                });
      //
      //             return { map, code, extractedComments };
      //          },
      //       }),
      //    ],
      // };
      config.resolve = {
         ...config.resolve,
         alias: {
            ...config.alias,
            "@components": path.resolve(__dirname, "src/components"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@mock": path.resolve(__dirname, "src/mock"),
            "@scss": path.resolve(__dirname, "src/scss"),
            "@services": path.resolve(__dirname, "src/services"),
            "@store": path.resolve(__dirname, "src/store"),
            "@interfaces": path.resolve(__dirname, "src/types"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@ui": path.resolve(__dirname, "src/ui"),
            "@modals": path.resolve(__dirname, "src/modals"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@http": path.resolve(__dirname, "src/http"),
         },
      };
      config.module.rules = [
         ...config.module.rules,
         {
            test: /\.module\.scss$/,
            include: path.resolve(__dirname, "./src/components"),
            use: [
               {
                  loader: "sass-resources-loader",
                  options: {
                     resources: require("./src/scss/scss-resourses"),
                  },
               },
            ],
         },
      ];
      config = rewireSvgSpriteLoader(config, env);

      config.resolve.modules = [path.resolve("src")].concat(config.resolve.modules);
      config.output = {
         ...config.output,
         publicPath: "",
      };
      config.plugins = [
         ...config.plugins,
         new DefinePlugin({
            "process.env.URL": JSON.stringify(process.env.URl),
            "process.env.API_URL": JSON.stringify(process.env.API_URL),
            "process.env.EDITOR_URL": JSON.stringify(process.env.EDITOR_URL),
         }),
      ];
      return config;
   },

   devServer: function(configFunction) {
      return function(proxy, allowedHost) {
         const config = configFunction(proxy, allowedHost)

         config.historyApiFallback.disableDotRule = true
         return config
      }
   }
}
