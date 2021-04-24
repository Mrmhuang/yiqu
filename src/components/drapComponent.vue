<template>
    <div class="main" @mousedown="down" @mousemove="move" @mouseup="up" :style="{ transform: `translate(${this.alterX}px,${this.alterY}px)`}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "drapComponent",
        data(){
            return {
                main : undefined,
                startX : undefined,
                startY : undefined,
                Xleft : 0,
                Ytop : 0,
                beginDrag: undefined,
                alterX:0,
                alterY:0
            }
        },
        methods:{
            down(e){
                this.beginDrag = true
                this.startX = e.pageX
                this.startY = e.pageY
            },
            move(e){
                if(this.beginDrag){
                    var main =  document.querySelector('.main')
                    this.alterX = e.pageX - this.startX + this.Xleft
                    this.alterY = e.pageY - this.startY + this.Ytop
                }
            },
            up(e){
                var main =  document.querySelector('.main')
                this.beginDrag = false
                this.Xleft += e.pageX - this.startX
                this.Ytop += e.pageY - this.startY
            }
        }
    }
</script>

<style scoped>
    .main{
        display: inline-block;
        position: relative;
        width: auto;
        height: auto;
    }
</style>
