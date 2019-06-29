(require '[cljs.build.api :as b])

(b/watch "src"
  {:main 'snake.core
   :output-to "out/snake.js"
   :output-dir "out"})
