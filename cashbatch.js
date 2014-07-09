function cashBatch(inp){
    
    var Arr=[];
    var Arr2=[];
    var ArrInvoice=[];
    var len,x;
    this.rawdata = inp || [];
    var data=[];
    var GlTime = new Date();
    var d = new Date();
    var invinc=0;
    var amtinc=0;
    var poinc2=0;
    var InvoiceLen,POLen;
    var TotalSec=0;
    data=this.rawdata;
    len=data.length;
    
    
    //InvoiceLen=0,POLen=0;
    //Prepare Data
    for (var i=0;i<len;i++){
        if (data[i][0]=='PO'){
            
            Arr.push(data[i]);
        }
        else if (data[i][0]=='INV'){
            ArrInvoice.push(data[i]);
        }
        }
    
    //Prepare Data
    for (var i=0;i<len;i++){
        if (data[i][0]=='Type:PO'){
            Arr.push(data[i]);
        }
        else if (data[i][0]=='Type:INV'){
            ArrInvoice.push(data[i]);
        }
        }
   POLen=Arr.length;
   InvoiceLen=ArrInvoice.length;
    
        this.backupData = this.data = Arr;
        this.count = this.data.length;
        console.info("Data reading successful..");
        console.info("Total Invoices are " + (InvoiceLen) + " and PO are " + (POLen) + ".");
        console.info("Time taken to create data object = " + ( (new Date().getTime() - d.getTime()) / 1000 ) + " seconds" );
        TotalSec=(new Date().getTime() - d.getTime()) / 1000 ;
      	console.info("If you are satisfied with the data, please use the below command to enter Invoice number.");
      	console.info("e.insertInvoice()");
      	
    function objcreator(data, type, code, reasonCode,i){
        var objCashBatch = { RemmitterName: '', Type: '', Amount: 0, Code: '', ReasonCode: '', InvoiceNumber: '', Key: null };
        objCashBatch.RemitterName = data[0];
        objCashBatch.Type = type;
        objCashBatch.Amount = data[2];
        objCashBatch.Code = code;
        objCashBatch.ReasonCode = reasonCode;
        objCashBatch.InvoiceNumber = data[1];
        objCashBatch.Key = null;
        return objCashBatch;
        }
    
    this.backupdata=Arr;
    
    this.insertInvoice = function() {
        
        if( this.isFrameAvailable() ) {
            
            var doc=this.DOCUMENT;
            var parentNode=doc.getElementsByClassName("PSLEVEL1GRIDNBO");
            var ch1 = parentNode[0].getElementsByTagName("TR");
            var availableRows = ch1.length-5;
            var parents = (parentNode.length)  - 1;
            
            //for (i=3;i<ch1.length-1;i++){  hasmukh
            for (i=3;i<ch1.length;i++){
                x=ch1[i].getElementsByClassName("PSEDITBOX");
                a=ArrInvoice.pop();
                x[0].value=a[1];
                invinc++;
            }
            
            if( InvoiceLen >= availableRows && invinc >= parents ){
    			console.info( "inc: " + invinc + ", parents: " + parents + ", len: " + len );
    			console.info( invinc + ", available rows have been filled....");
    			console.info("Please add another " + (InvoiceLen - (invinc)) + " rows to continue with insert....");
    			console.info("Please use the below command again, once you have added sufficient rows");
    			console.info("e.insertInvoice()");
    			console.info("After completion of inserting invoice number please use below commend for Inserting PO details");
    			console.info("And go to the last Invoice number and add " + Arr.length + " rows");
    			console.info("Please use the below command for that");
    			console.info("e.insertAmount()");
    		}
    		else{
    		    console.info("Please use the below command for insert PO details");
    			console.info("e.insertAmount()");
    		    
    		}
        } else {
            console.error("Frame not found...Please refresh the Page and retry again, else contact the administrator!");
        }
    }
    
    
    this.DOCUMENT = null;
    
    this.isFrameAvailable = function () {
        var frame = window.frames, pathname,
            doc;
        //for (var x = 0; x < frame.length; x++) {
            //doc = frame[x].document;          Hasmukh
            doc = frame[2].document;
            //if (doc) {
              //  pathname = (doc.location.pathname).split("/");
            //  	pathname = pathname[pathname.length - 1];
               	
    //          	if ( pathname.match("APPLY_PAYMENTS.PAYMENT_WS_IC.htm") || pathname.match("APPLY_PAYMENTS.PAYMENT_IDENT_IC.htm")) {
                  	this.DOCUMENT = doc;
                    return !0;
        //        }
         //   }
        //}
        //return !1;
    }
    //for invoice number becasue in invoice page frame name is diffrent (page 1).
    
    
    
    this.getView = function(){
        var text = this.DOCUMENT.getElementsByClassName("psgridcounter")[0].innerText;
        var n = text.match(/\d{1,}/g);
        return { from: Number(n[0]), to: Number(n[1]), of:Number(n[2]) }
    }
    
   
    this.insertAmount = function() {
        
        if( this.isFrameAvailable()){
            
            var doc = this.DOCUMENT;
            var view = this.getView();
            var x,a;
            if(view.to != view.of) {
                return console.info("Please select View All OR navigate to the last view page");
            }
            
            var lenOfInv = view.to - (view.from-1);
            var parentNode=doc.getElementsByClassName("PSLEVEL1GRIDWBO");
            var ch1 = parentNode[0].getElementsByTagName("TR");
            var parents = (ch1.length)  - 4;
            
            //if(lenOfInv >= parents ){                     //below 3 three row hasmukh
              //  return console.error("Please add " + Arr.length  + " rows more")
            //}
            
            var i = lenOfInv + 1,
            
            availableRows=parents-i,
                  poinc=poinc;
                    
            for(i=0;i<parents;i++)  
            {
            //for (i=1;(i< Arr.length) || (i<parents);i++)   
            
                x=ch1[i+4].getElementsByClassName("PSEDITBOX");
            if (x[0].value === "") {
                a=Arr.pop();
                x[0].value=a[2];
                x[3].value=a[3];
                x[4].value=a[4];
                a.push(ch1[i+4].getElementsByClassName("PSEDITBOX_DISPONLY")[0].innerText);
                a.push(x[1].value);
                Arr2.push(a);
                amtinc++;
            }
            
            }
                if( amtinc < POLen ){
    				console.info( "inc: " + amtinc + ", parents: " + parents + ", len: " + POLen );
    				console.info( (amtinc) + ", available rows have been filled....");
    				console.info("Please add another " + (POLen - (amtinc)) + " rows to continue with insert....");
    				console.info("Please use the below command again, once you have added sufficient rows");
    				console.info("e.insertAmount()");
    				console.info("After completion of inserting PO details please use below commend for Inserting PO Number"); 
    			    console.info("e.insertPO()");
        		}
        		else{
        		    console.info("Please use the below command for insert PO Number");
    			    console.info("e.insertPO()");
        		    
        		}
        } 
        else {
            console.error("Frame not found...Please refresh the Page and retry again, else contact the administrator!");
        }
    }
    
    this.insertPO = function() {    
        
        //var frame = window.frames[2],
          //  doc = frame.document,
//            tables = doc.getElementsByClassName("PSFRAME"),
  //          i = 0,
//            len = tables.length,
 //           temp = '',
  //          arrLen = Arr2.length;
        
//        for (;i<len;i=i+3){
  //          temp = (tables[i].getElementsByClassName("PSEDITBOX_DISPONLY")[0].innerText).toString()
//            editbox[temp] = tables[i+1].getElementsByClassName("PSEDITBOX")[3]
  //      }
        
//        for(i = 0; i< arrLen; i++){
  //         editbox[ Arr2[i][5] ].value = Arr2[i][1]
//        }
    
//  function getChild(){
        
            var frame = window.frames[2],
            doc = frame.document,
            tables = doc.getElementsByClassName("PSFRAME"),
            i = 0,
            len = tables.length,
            temp = '',
            arrLen = Arr2.length;
            var editbox=[];
        
        for (;i<len;i=i+3){
            temp = (tables[i].getElementsByClassName("PSEDITBOX_DISPONLY")[0].innerText).toString()
            //temp = tables[i].getElementsByClassName("PSEDITBOX")[1]

            editbox[temp] = tables[i+1].getElementsByClassName("PSEDITBOX")[3]
        }
        
        for(i = 0; i< arrLen; i++){
           if (editbox[ Arr2[i][5] ]) editbox[ Arr2[i][5] ].value = Arr2[i][1];poinc2++;
        }
        
        
        
        if(poinc2 < arrLen ){
            	//console.info( "inc: " + poinc2 + ", parents: " + parents + ", len: " + len );
				//console.info( poinc2 + ", available rows have been filled....");
				//console.info("Please add another " + (POLen - (po2inc)) + " rows to continue with insert....");
				console.info( poinc2 + ", PO Refernces have been filled....");
				console.info( (ArrLen - poinc2) + ", PO Refernces Remain....");
				console.info("Please go to next page");
				console.info("Then use the below command again");
				console.info("e.insertPO()");
			}
			else{
			    console.info("All PO number has been inserted.");
			    
			}
    }
    
    }
