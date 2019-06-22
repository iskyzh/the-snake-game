const WIDTH = 800
const HEIGHT = 600
const BLOCK_SIZE = 20
const MAX_X = WIDTH / BLOCK_SIZE, MAX_Y = HEIGHT / BLOCK_SIZE
const UPDATE_RATE = 10

function update_snake($snake_block) {
    $snake_block
        .attr("x", d => d.x * BLOCK_SIZE)
        .attr("y", d => d.y * BLOCK_SIZE)
        .attr("width", BLOCK_SIZE)
        .attr("height", BLOCK_SIZE)
}

function create_snake($snake_block) {
    $snake_block
        .attr("class", "snake")
        .call(update_snake)
}

function update_food($food_block) {
    $food_block
        .attr("x", d => d.x * BLOCK_SIZE)
        .attr("y", d => d.y * BLOCK_SIZE)
        .attr("width", BLOCK_SIZE)
        .attr("height", BLOCK_SIZE)
        .style("fill", "blue")
}

function create_food($food_block) {
    $food_block
        .attr("class", "food")
        .call(update_food)
}

function random_int(x) {
    return Math.floor(Math.random() * x)
}

$(document).ready(() => {
    const $snake = d3.select("#snake")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)

    const snake = [{x: 0, y: 0}]
    let food = []
    let dx = 1, dy = 0
    let cnt = 0

    progress_game()

    function generate_food() {
        let x = 0, y = 0
        do {
            x = random_int(MAX_X)
            y = random_int(MAX_Y)    
        } while (_.some(snake, s => s.x == x && s.y == y))
        return { x, y }
    }

    function is_game_over() {
        return _.some(snake.slice(1), s => s.x == snake[0].x && s.y == snake[0].y)
    }

    function progress_game() {
        if ((cnt++) % UPDATE_RATE == 0) {
            // update snake location
            const next_block = snake[0]
            let _x = next_block.x + dx
            let _y = next_block.y + dy
            if (_x < 0) _x += MAX_X;
            if (_y < 0) _y += MAX_Y;
            if (_x >= MAX_X) _x -= MAX_X;
            if (_y >= MAX_Y) _y -= MAX_Y;
            const snake_tail = snake.pop()
            snake.unshift({x:_x, y:_y})

            // update food location
            if (food.length == 0) food.push(generate_food())
            food = food.filter(f => {
                if (f.x == _x && f.y == _y) {
                    snake.push(snake_tail)
                    food.push(generate_food())
                    return false
                }
                return true
            })

            if (is_game_over()) location.reload()

            // redraw
            const $snake_block = $snake
                .selectAll(".snake")
                .data(snake)
            $snake_block.call(update_snake)
            $snake_block.enter()
                .append("rect")
                .call(create_snake)
            $snake_block.exit().remove()

            const $food_block = $snake
                .selectAll(".food")
                .data(food)
            $food_block.call(update_food)
            $food_block.enter()
                .append("rect")
                .call(create_food)
            $food_block.exit().remove()
        }
        window.requestAnimationFrame(progress_game)
    }

    $("body").keydown(e => {
        if (e.key == "ArrowUp") { dx = 0; dy = -1; }
        if (e.key == "ArrowDown") { dx = 0; dy = 1; }
        if (e.key == "ArrowLeft") { dx = -1; dy = 0; }
        if (e.key == "ArrowRight") { dx = 1; dy = 0; }
    })
})