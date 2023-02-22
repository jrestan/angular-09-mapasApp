import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { ZoomRangeComponent } from '../zoom-range/zoom-range.component';

interface Marcador{
  color: string;
  marker?: mapboxgl.Marker;  // ? para q sean opcionales
  centro?: [number, number]; 
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }
    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li{
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  miCasa: [number, number] = [-77.00648331728992, -12.11750778211622];

  lastCenter: [number, number] = this.miCasa;

  // Arreglo de marcadores
  marcadores: Marcador[] = [];
    
  constructor() { }
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
    this.mapa = new mapboxgl.Map({
        container: this.divMapa.nativeElement,    //se usa aqui this.divMapa
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.miCasa,
        zoom: this.zoomLevel
    });

    /*
    const marker = new mapboxgl.Marker()
      .setLngLat( this.center )
      .addTo( this.mapa );*/
    // con lo de arriba poermite tener la referencia, pero con lo de abajo es suficiente para que se cree el marcador
    /*
    //CON esto se crea un marcador con un contenido HTML.........
    //
    const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'Mi Casa'

    new mapboxgl.Marker({element: markerHtml})
      .setLngLat( this.center )
      .addTo( this.mapa );
    */
    
    this.leerMarcadoresLocalStorage();

  }

  agregarMarcador(){
    
    //va a Generar un color aleatorio hexadecimal
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    
    const nuevoMarcador = new mapboxgl.Marker({draggable: true, color: color})
      .setLngLat(this.lastCenter)
      .addTo(this.mapa);  //<== con esto se agrega el marcador
    
    this.marcadores.push({   //<== con esto se guarda la referencia del nuevo marcador ya agregado...
      color,  //podria ser color: color pero esta version de ECMAScript permite hacerlo de esta forma
      marker: nuevoMarcador
    });
    
    //console.log(this.marcadores);

    nuevoMarcador.on('dragend', ()=>{
      //console.log('dragend',nuevoMarcador.getLngLat());
      const {lng, lat} = nuevoMarcador.getLngLat();
      this.lastCenter = [lng, lat];
      this.guardarMarcadoresLocalStorage();
    });
    
    this.guardarMarcadoresLocalStorage();
    
  }

  irMarcador(index: number){

    //console.log(this.marcadores[index]);
    //this.marcadores[index].marker.getLngLat();

    this.mapa.flyTo({
      center: this.marcadores[index].marker!.getLngLat()
    });

  }

  borrarMarcador(index: number){
    
    this.marcadores[index].marker?.remove();
    this.marcadores.splice(index, 1);
    this.guardarMarcadoresLocalStorage();

  }

  guardarMarcadoresLocalStorage(){

    const lngLatArr: Marcador[] = [];

    this.marcadores.forEach(m=>{
      
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();
      
      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      })

    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr) );
    
  }

  leerMarcadoresLocalStorage(){

    if( !localStorage.getItem('marcadores')){
      return;
    }
    
    const lngLarArr: Marcador[] = JSON.parse( localStorage.getItem('marcadores')! );

    console.log(lngLarArr);

    lngLarArr.forEach(m=>{

      const nuevoMarcador = new mapboxgl.Marker({draggable: true, color: m.color})
        .setLngLat(m.centro!)
        .addTo(this.mapa);   //<== con esto se agrega el marcador
        
      this.marcadores.push({   //<== con esto se guarda la referencia del nuevo marcador ya agregado...
        color: m.color,
        marker: nuevoMarcador
      });

      nuevoMarcador.on('dragend', ()=>{
        //console.log('dragend',nuevoMarcador.getLngLat());
        const {lng, lat} = nuevoMarcador.getLngLat();
        this.lastCenter = [lng, lat];
        this.guardarMarcadoresLocalStorage();
      });
      
    });
    
    
  }
  
}
