class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 600
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        this.shots = 0
        this.score = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4).setOffset(this.cup.width/4).setImmovable(true)
        // add ball
        this.ball = this.physics.add.sprite(width/2, height*9/10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5, 0.5)
        this.ball.body.setDamping(true).setDrag(0.5)
        // add walls
        this.wall1 = this.physics.add.sprite(0, height/4, 'wall')
        this.wall1.x = Phaser.Math.Between(0 + this.wall1.width/2, width - this.wall1.width/2)
        this.wall1.body.setImmovable(true)

        this.wall2 = this.physics.add.sprite(0, height/2, 'wall')
        this.wall2.x = Phaser.Math.Between(0 + this.wall2.width/2, width - this.wall2.width/2)
        this.wall2.body.setImmovable(true)
        // add one-way
        this.oneway = this.physics.add.sprite(0, height*3/4, 'oneway')
        this.oneway.x = Phaser.Math.Between(0 + this.oneway.width/2, width - this.oneway.width/2)
        this.oneway.body.setImmovable(true).checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer)=>{
            let shotDirection = new Phaser.Math.Vector2(pointer.x - this.ball.x , pointer.y - this.ball.y).normalize()
            console.log(shotDirection)
            this.ball.setVelocityX(-this.SHOT_VELOCITY_X*shotDirection.x)
            this.ball.setVelocityY(-Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX)*shotDirection.y)
            this.shots += 1
        })
        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup)=>{
            ball.setVelocityX(0)
            ball.setVelocityY(0)
            ball.x = width/2
            ball.y = height*9/10
            this.score += 1
        })
        // ball/wall collision
        this.walls = this.add.group([this.wall1,this.wall2, this.oneway])
        this.physics.add.collider(this.ball, this.walls, null, null)
        // ball/one-way collision
        //shots
        this.shotText = this.add.text(width/8, height/12, 'shots: ' + this.shots).setBackgroundColor('black')
        this.scoreText = this.add.text(width/8, height/10, 'score: ' + this.score).setBackgroundColor('black')
        this.percentText = this.add.text(width/8, height/8.5, 'percent: ' + this.score / this.shots).setBackgroundColor('black')
    }

    update() {
        this.shotText.text = ('shots: ' + this.shots)
        this.scoreText.text = ('score: ' + this.score)
        this.percentText.text = ('percent: ' + Math.floor(this.score / this.shots * 100) + '%')

        this.oscillate(this.wall2)
    }
    
    oscillate(item){
        if (!item.dir){
            item.dir = -1
        }
        item.x += item.dir * 3
        if (item.x <= 0 + item.width/2){
            item.dir = 1
        }
        if (item.x >= width - item.width/2){
            item.dir = -1
        }
    }

}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[x] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[x] Make one obstacle move left/right and bounce against screen edges
[x] Create and display shot counter, score, and successful shot percentage
*/