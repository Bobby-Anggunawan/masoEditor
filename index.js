//https://www.dofactory.com/javascript/design-patterns/builder

function masoEditor() {

    this.buildedEditor = null;  // editor yang akan di masukkan ke html
    this.buildedToolbar = null; // toolbar editor yang akan dimasukkan ke html
    
    this.editor = {
        id: "",                  // id dari komponen editor dan juga name dari input
        name: null,             // optional, kalau ini diisi, name dari input bakal pakai ini bukan id
        editorType: "field",    // nilai antara "section" dan "field"
        toolbarType: "lines",   // nilai antara "lines" atau "table"
        toolbarButtons: [
            //line 1
            [
                //segmen 1 di line 1
                [
                    //button 1 di segment 1 line 1
                    {
                        display: `<span>Undo</span>`,
                        onClick: function(){
                            masoEditor().applyCommand("undo");
                        },
                        isSelected: function(){
                            return false;
                        }
                    },
                    {
                        display: `<span>Redo</span>`,
                        onClick: function(){
                            masoEditor().applyCommand("redo");
                        },
                        isSelected: function(){
                            return false;
                        }
                    },
                ]
            ]
        ]    // objek kumpulan seperti {display: "html code", onClick: function(){}, isSelected: function(){return true;}}
    };

    //start-kumpulan constructor====================================================================================================
    this.setEditor = function (type = "field") {
        this.editor.editorType = type;
    };
    this.setToolbar = function (type = "lines", buttons = null) {
        this.editor.toolbarType = type;
        this.editor.toolbarButtons = buttons;
    };

    this.build = function (id, name = null) {
        this.editor.id = id;
        this.editor.name = name;

        switch(this.editor.editorType) {
            case "section":
                this.buildedEditor = this.generateEditorSection();
                break;
            case "field":
                this.buildedEditor = this.generateEditorField();
                break;
            default:
                //code block
                throw "editor.type belum diimplementasikan";
        }


        switch(this.editor.toolbarType) {
            case "lines":
                this.buildedToolbar = this.generateToolbarLines();
                break;
            case "table":
                this.buildedToolbar = this.generateToolbarTable();
                break;
            default:
                //code block
                throw "editor.type belum diimplementasikan";
        }

        //start-masukkan editor dan toolbar ke container yan dispesifikasikan idnya ke parameter fungsi build
        var getEditorContainer = document.getElementById(id);
        getEditorContainer.appendChild(buildedToolbar);
        getEditorContainer.appendChild(buildedEditor);
        //end---masukkan editor dan toolbar ke container yan dispesifikasikan idnya ke parameter fungsi build

        return this.editor;
    };
    //end---kumpulan constructor====================================================================================================

    //start-editor generator====================================================================================================
    this.generateEditorField = function (){

        var editor = document.createElement("div");
        editor.classList.add("masoEditorEditor");
        editor.setAttribute("contenteditable", true);
        editor.id = `${this.editor.id}_masoEditorEditor`;

        return editor;
    }
    this.generateEditorSection = function (){
        throw "generateEditorSection belum diimplementasikan";
    }
    //end---editor generator====================================================================================================
    


    //start-toolbar generator====================================================================================================
    this.generateToolbarLines = function(){

        var toolbar = document.createElement("div");
        toolbar.classList.add("masoEditorToolbar");

        this.editor.toolbarButtons.forEach((lines)=>{

            var buildLines = document.createElement("div");
            buildLines.classList.add("masoEditorToolbarLines");

            lines.forEach((segment)=>{

                var buildSegment = document.createElement("div");
                buildSegment.classList.add("masoEditorToolbarLinesSegment");

                segment.forEach((buttons)=>{
                    var buildButton = document.createElement("button");
                    buildButton.innerHTML = buttons.display;
                    buildButton.addEventListener("mousedown", (event) => {
                        event.preventDefault(); //buat focus di editor tidak beralih ke button ini
                    });
                    buildButton.addEventListener("click", (event) => {
                        buttons.onClick();
                    });

                    //todo, button belum dipasang onclick
                    buildSegment.appendChild(buildButton);
                });

                buildLines.appendChild(buildSegment);

            });

            toolbar.appendChild(buildLines);
        });

        return toolbar;
    }
    this.generateToolbarTable = function(){
        throw "generateToolbarTable belum diimplementasikan";
    }
    //end---toolbar generator====================================================================================================
    

    //start-util====================================================================================================
    this.applyCommand = function(commandName, params = null){
        switch(commandName) {
            case "undo":
                /*
                params: gak ada param di command ini
                */
                document.execCommand("undo");
                break;
            case "redo":
                /*
                params: gak ada param di command ini
                */
                document.execCommand("redo");
                break;
            default:
                //code block
                throw `Command ${commandName} belum diimplementasikan`;
        }            
    }
    this.getSelectedNodes = function(){

        var ret = [];
    
        var selection = window.getSelection();
        
        var currentNode = selection.anchorNode;
        var lastNode = selection.focusNode;
        //lihat ke depan dari currentNode ke lastNode
        // note ada kasus hasilnya malah gagal
        while(true){
            if(currentNode != null){
                ret.push(currentNode);
            }
            
            if(currentNode == lastNode || currentNode == lastNode.parentNode){
                break;
            }
            else{
                try{
                    currentNode = currentNode.nextSibling ?? currentNode.parentNode.nextSibling;
                }
                catch(e){
                    break;
                }
            }
        }
    
        
        return {
            listNodes: ret,
            anchorOffset: selection.anchorOffset,
            baseOffset: selection.baseOffset
        };
    }
    //kalau ini true, berarti cuma 1 elemen yang diselect jadi tag bisa langsung diapply
    this.selectionInsideSameElement = function(){
        //return true jika yang diselect cuma 1 element. kalau ada 2 element yang diselect, akan return false
        // jadi kalau true, tag bisa langsung diapply
        // kalau false, harus ada proses lain untuk apply tag
        return window.getSelection().anchorNode == window.getSelection().focusNode
    }
    
    // tagName string nama tag
    this.surroundContents = function(tagName){

        // note untuk replace list node di getSelectedNodes()
        // pertama hapus semua node kecuali node pertama
        // kedua replace node pertama dengan node baru :)

        ////////////////////////////////////////////////////////==================
        //untuk surround tag, pertama split anchour node
        // terus split base node
        // dan kalau ada node di tengah, semua node ditengah masuk tag baru

        if(this.selectionInsideSameElement()){
            pseudo-langsungApplyTag();
        }
        else{
            pseudo-merge();
        }
    }
    //end---util====================================================================================================

    return this;

}
  
//module.exports = masoEditor