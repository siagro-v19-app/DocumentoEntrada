sap.ui.define([
	"br/com/idxtecDocumentoEntrada/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"br/com/idxtecDocumentoEntrada/services/Session"
], function(BaseController, MessageBox, Filter, FilterOperator, Session) {
	"use strict";

	return BaseController.extend("br.com.idxtecDocumentoEntrada.controller.DocumentoEntradaLista", {
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            
            var iEmpresaId = Session.get("EMPRESA_ID");
            
			var oFilter = new Filter("Empresa", FilterOperator.EQ, iEmpresaId);
			var oView = this.getView();
			var oTable = oView.byId("tableDocumento");
			
			oTable.bindRows({ 
				path: '/DocumentoEntradas',
				sorter: {
					path: 'TipoDocumentoDetails/Descricao'
				},
				filters: oFilter,
				parameters: {
					expand: 'TipoDocumentoDetails,ParceiroNegocioDetails'
				}
			});
		},
		
		filtraDoc: function(oEvent){
			var sQuery = oEvent.getParameter("query");
			var iEmpresaId = Session.get("EMPRESA_ID");
			
			var oFilter1 = new Filter("Empresa", FilterOperator.EQ, iEmpresaId);
			var oFilter2 = new Filter("Descricao", FilterOperator.Contains, sQuery);
			
			var aFilters = [
				oFilter1,
				oFilter2
			];

			this.getView().byId("tableDocumento").getBinding("rows").filter(aFilters, "Application");
		},
		
		onRefresh: function() {
			this.getModel().refresh(true);
			this.getView().byId("tableQuadro").clearSelection();
		},
		
		onIncluir: function(oEvent) {
			this.getRouter().navTo("documentoEntradaAdd");
		},
		
		onEditar: function(oEvent) {
			var oTable = this.getView().byId("tableDocumento");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex > -1) {
				var oContext = oTable.getContextByIndex(nIndex);
				this.getRouter().navTo( "documentoEntradaEdit" , {
					documento: oContext.getProperty( "Id" )
				});
				
			} else {
				MessageBox.warning("Selecione um documento da tabela.");
			}
			
			oTable.clearSelection();
		},
		
		onRemover: function(e){
			var that = this;
			var oTable = this.byId("tableDocumento");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex === -1){
				MessageBox.warning("Selecione um documento da tabela.");
				return;
			}
			
			MessageBox.confirm("Deseja remover este documento de entrada?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("Documento de entrada removido com sucesso!");
					}
				}
			});
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				}
			});
		}
	});
});