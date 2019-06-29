(ns snake.core
  (:require [cljsjs.d3]
            [cljsjs.jquery]))
(enable-console-print!)

(def data {:snake [{:x 0, :y 0}, {:x 1, :y 0}, {:x 2, :y 0}]
           :direction {:dx 1, :dy 0}})

(def width 800)
(def height 600)
(def block_size 20)
(def max_x (/ width block_size))
(def max_y (/ height block_size))

(defn update-status []
  (-> (js/$ "#snake-status")
      (.text "Score")
  ))

(defn append-svg []
  (-> js/d3
      (.select "#snake")
      (.append "svg")
      (.attr "height" height)
      (.attr "width" width)))

(defn create-snake [snake]
  (-> snake
    (.attr "class" "snake")
    (.attr "fill" "black")
    (.attr "width" block_size)
    (.attr "height" block_size)))

(defn update-snake [snake]
  (-> snake
      (.attr "x" 
        (fn [s] (-> (:x s)
                    (* block_size))))
      (.attr "y"
        (fn [s] (-> (:y s)
                    (* block_size))))))

(defn remove-snake [snake]
  (-> snake
      (.remove)))

(defn get-next [s ds ms]
  (def ns (+ s ds))
  (cond
    (< ns 0) (+ ns ms)
    (>= ns ms) (- ns ms)
    :else ns)
)

(defn progress-snake [svg data]
  (def direction (:direction data))
  (def snake 
    (let [snake (:snake data)
          head (last snake)
          others (subvec snake 1)
          new_head {:x (get-next (:x head) (:dx direction) max_x),
                    :y (get-next (:y head) (:dy direction) max_y)}]
      (conj others new_head)
    ))
  (-> svg
      (.selectAll ".snake")
      (.data (into-array snake))
        (.call update-snake)
      (.enter)
        (.append "rect")
        (.call create-snake)
        (.call update-snake)
      (.exit)
        (.call remove-snake))
  (assoc data :snake snake))

(defn progress-game [svg data]
  (progress-snake svg data))

(defn game [svg data frame]
  (js/requestAnimationFrame (fn [] 
    (game svg (if (= frame 0) (progress-game svg data) data) (mod (+ frame 1) 3)))))

(defn ^:export main []
  (let [svg (append-svg)]
    (game svg data 0)))
      