import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }
    .row {
      background-color: white;
      border-radius: 5px;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      z-index: 999;
      width: 400px
    }
    `
  ]
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 18;
  center: [number, number] = [-77.00648331728992, -12.11750778211622];

  constructor() { 
    console.log('constructor', this.divMapa); //saldra undefined
  }
    
  ngOnInit(): void {
    console.log('onInit', this.divMapa);  //saldra undefined
  }

  ngAfterViewInit(): void {
    
    console.log('ngAfterViewInit', this.divMapa); //ok
    
    this.mapa = new mapboxgl.Map({
        container: this.divMapa.nativeElement,    //se usa aqui this.divMapa
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.center,
        zoom: this.zoomLevel
    });

    new mapboxgl.Marker({})
      .setLngLat( this.center )
      .addTo( this.mapa );

    this.mapa.on('zoom', (ev)=>{
      //console.log('zoom', ev);
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', (ev)=>{
      if(this.mapa.getZoom()>18){
        this.mapa.zoomTo(18);
      }
    });
    
    this.mapa.on('move',(event)=>{
      //console.log(event);
      const target = event.target;

      //console.log(target.getCenter());
      const {lng, lat} = target.getCenter();
      
      this.center = [lng, lat];
      
    });

  }

  ngOnDestroy(): void {

    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});

  }


  zoomCambio(value: any){
    //console.log(value);
    this.mapa.zoomTo(Number(value));    
  }
  
  zoomOut(){
    this.mapa.zoomOut();
    //console.log('zoomOut', this.divMapa);
    //this.zoomLevel = this.mapa.getZoom();
  }

  zoomIn(){
    this.mapa.zoomIn();
    //this.zoomLevel = this.mapa.getZoom();
  }

}
