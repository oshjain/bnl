function edi(inp){
    
    this.data = null;
    this.count = 0;
    this.rawdata = inp || [];
    this.backupData = null;
    this.usedKeys = {};
    
  	this.filldata = function () {
  		
  		var d = new Date();
  		
        if (!this.rawdata.length) {
            console.error("No raw data found...now exiting!!");
          	return !1;
        }
        
      var myobj = [], tempholder = [],
            data = this.rawdata,
            len = data.length,
            key, o, grandtotal = 0;
    
        function splitString(string) {
            var d = string.split(" ");
          	return {
          	    billno: "",
                gl: d[0],
                account: d[1],
                dept: d[2],
                product: d[3],
                amt: null
            }
        }
        for (var x = 0; x < len; x++) {
            o = splitString(data[x][1]);
            o.billno = data[x][0];
          	o.amt = Number((data[x][2]).toFixed(2))
            grandtotal += o.amt;
            myobj.push(o);
        }
        
        this.backupData = this.data = myobj;
        this.count = this.data.length;
        console.info("Data reading successful..");
        console.info("Total Entries are " + (this.count));
        console.info("The total amount of all entries is " + grandtotal.toFixed(2));
        console.info("Please do check this Total amount with the total amount in your spreadsheet");
      	console.info("before initiating the insert process of regular entries");	
      	console.info("Time taken to create data object = " + ( (new Date().getTime() - d.getTime()) / 1000 ) + " seconds" );
      	console.info("If you are satisfied with the total amount, please use the below command to insert EDI")
      	console.info("e.insert()")
      	return this;
    }

    
    this.insert = function () {
        
        var d = new Date();
      	var f = this.isFrameAvailable();
        if (!f) {
            console.error('Frame ENTER_VOUCHER_INFORMATION.VCHR_EXPRESS, not found'); 
            console.info('Probably, you are not posting Regular Vouchers');
            console.info('exiting....');
            return !1;
        }
        var doc = this.DOCUMENT,
            PARENT_TABLE_CLASSNAME = 'psgroupbox',
            CHILD_TABLE_CLASSNAME = 'pslevel2grid',
            TEXTBOX_CLASSNAME = 'pseditbox',
            parentNode = doc.getElementsByClassName(PARENT_TABLE_CLASSNAME),
      	    inc = 3,availableRows = 0,a, key = 0,x = 0, len, tr, input, childTable, item;
        
        var parents = (parentNode.length)  - 1
        len = this.data.length;
        availableRows = parents - 3;
        //if( parents < len ) {
		//	return console.error( "The Number of tabes available are lesser than available data\n\nData Count          " + (len) + "\nTables              "	+  (parents)   + "\n------------------------\nDifference          " +  ( len - parents) + "\n------------------------\n\nPlease add " + (len - parents) + " more tables to the page before inserting data" ), 0;
		//}
		
		function setValue(i, v){
			i[0].value = v.amt;
            i[2].value = v.gl; 
            i[3].value = v.account;
            i[6].value = v.dept;
            i[7].value = v.product;	
		}
        
        while (key in this.data) {
																															      
            tr = parentNode[inc].getElementsByTagName("tr");
          	
          	input = tr[7].getElementsByClassName(TEXTBOX_CLASSNAME);
          	
          	item = this.data.pop();
          	
          	input[1].value = item.billno;
          	
          	input[5].value = ( item.amt )
          	
            childTable = parentNode[inc].getElementsByClassName( CHILD_TABLE_CLASSNAME )[0];
          	
            setValue( childTable.getElementsByClassName( TEXTBOX_CLASSNAME ), item )

            inc++;
            if( len > availableRows && inc >= parents ){
				console.log( "inc: " + inc + ", parents: " + parents + ", len: " + len )
				console.info( availableRows + ", available rows have been filled....");
				console.info("Please add another " + (len - (inc-3)) + " rows to continue with insert....");
				console.info("Please use the below command again, once you have added sufficient rows");
				console.info("e.insert()");
				break;
			}
        }

        console.info( "Data inserted successfully....");
        console.info("Total Time Taken to insert data into People Soft = " + ((new Date().getTime() - d.getTime())/1000) + " seconds..");
    }
    
  	this.DOCUMENT = null;
  
    this.isFrameAvailable = function () {
        var frame = window.frames, pathname,
            doc;
        for (var x = 0; x < frame.length; x++) {
            doc = frame[x].document;
            if (doc) {
                pathname = (doc.location.pathname).split("/");
              	pathname = pathname[pathname.length - 1];
               	
              	if ( pathname.match("ENTER_VOUCHER_INFORMATION.VCHR_EXPRESS")) {
                  	this.DOCUMENT = doc;
                    return !0;
                }
            }
        }
        return !1;
    }
    this.filldata()
}  


