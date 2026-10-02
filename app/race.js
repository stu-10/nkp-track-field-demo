export class Race {
  constructor() { this.reset(); }
  reset() { this.state='ready'; this.distance=0; this.speed=0; this.elapsed=0; this.last=null; this.steps=0; this.startAt=0; this.lastAt=-Infinity; }
  start(now) { this.reset(); this.state='countdown'; this.startAt=now+3000; }
  update(now, dt) {
    if (this.state==='countdown' && now>=this.startAt) this.state='running';
    if (this.state!=='running') return;
    const actual = Math.min(dt, Math.max(0,(now-this.startAt)/1000));
    const previous=this.distance;
    this.speed=Math.max(0,this.speed-2.8*actual);
    this.distance+=this.speed*actual;
    this.elapsed=(now-this.startAt)/1000;
    if (this.distance>=100) {
      this.elapsed-=this.speed>0 ? (this.distance-100)/this.speed : 0;
      this.distance=100; this.state='finished';
    }
  }
  step(side, now) {
    if (this.state==='countdown' && now<this.startAt) { this.state='false-start'; return false; }
    if (this.state==='countdown') this.state='running';
    if (this.state!=='running' || side===this.last || now-this.lastAt<55) return false;
    this.last=side; this.lastAt=now; this.steps++;
    this.speed=Math.min(12.5,this.speed+0.85); return true;
  }
}
