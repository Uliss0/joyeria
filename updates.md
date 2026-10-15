#ToDo
el envio express no aumenta el valor de la compra. Al completar la compra, el resumen muestra el cobro del envio igualmente
 Api key de correo argentino. cuenta de mail.
El seguimiento de envio se hace registrando en https://www.correoargentino.com.ar/MiCorreo/public/contact



#ToDO2
mail no funciona todavia.
compras no funcionan todavia.(mp)
Falta ver detalles de una compra.(como lo que se envia por mail)
mail con dominio
tas.
revisar flujo de compra completo





#### 1. Configurar el ID real de Google Analytics 4                                                                           
                                                                                                                                
  1. Entrá a Google Analytics https://analytics.google.com/ con tu cuenta de Google.                                            
  2. Si no tenés una propiedad creada, creá una para Moksha Joyería y seleccioná plataforma Web.                                
  3. Te va a entregar un ID de Medición que empieza con G- (por ejemplo: G-ABC123XYZ4).                                         
  4. Abrí tu archivo .env y completalo en:                                                                                      
    NEXT_PUBLIC_GA_ID="G-TU_ID_AQUI"                                                                                            
  (No hace falta tocar ningún archivo de código, el layout lo toma automáticamente).                                            
                                                                                                                                
  #### 2. Verificar el dominio en Google Search Console                                                                         
                                                                                                                                
  1. Entrá a Google Search Console https://search.google.com/search-console.                                                    
  2. Añadí tu propiedad:                                                                                                        
      • Recomendado: Tipo Prefijo de la URL -> https://mokshajoyeria.com.                                                       
  3. Para verificar la propiedad:                                                                                               
      • Podés elegir Etiqueta HTML y copiar el código alfanumérico que te da content="...".                                     
      • Pegá ese código en .env:                                                                                                
        NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="tu_codigo_alfanumerico"                                                           
                                                                                                                                
      • O verificalo mediante registro DNS (TXT) en el panel donde compraste tu dominio.                                        
  4. Una vez verificado, andá a la pestaña Sitemaps en el menú de la izquierda e ingresá:                                       
    sitemap.xml                                                                                                                 
  Hacé clic en Enviar. Google comenzará a rastrear todas las páginas y productos.                                               
                                                                                                                                
  #### 3. Confirmar datos de la empresa en datos estructurados                                                                  
                                                                                                                                
  En OrganizationStructuredData.tsx:                                                                                            
                                                                                                                                
  • El teléfono ya toma automáticamente el de .env (NEXT_PUBLIC_WHATSAPP_NUMBER).                                               
  • Si tenés los links definitivos de Instagram / Facebook de la marca, podés actualizarlos en el array sameAs de ese componente.