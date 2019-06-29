(defproject snake "0.1.0-SNAPSHOT"
  :description "the snake game"
  :url "https://github.com/skyzh/the-snake-game"
  :dependencies [[org.clojure/clojure "1.9.0"]
                 [org.clojure/clojurescript "1.10.339"]
                 [org.clojure/core.async  "0.3.443"]
                 [cljsjs/d3 "4.12.0-0"]
                 [cljsjs/jquery "3.4.0-0"]]
  :jvm-opts ^:replace ["-Xmx1g" "-server"]
  :plugins [[lein-npm "0.6.2"]]
  :npm {:dependencies [[source-map-support "0.4.0"]]}
  :source-paths ["src" "target/classes"]
  :clean-targets [:target-path "out" "release"]
  :target-path "target")
