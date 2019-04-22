sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"br/com/idxtecDocumentoEntrada/helpers/CentroCustoHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/CfopHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/CondicaoPagamentoHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/ContaContabilHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/ContratoCompraHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/NaturezaOperacaoHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/ParceiroNegocioHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/ProdutoHelpDialog",
	"br/com/idxtecDocumentoEntrada/helpers/TipoDocumentoHelpDialog",
	"br/com/idxtecDocumentoEntrada/services/Session"
], function(Controller, MessageBox, JSONModel, History, CentroCustoHelpDialog, CfopHelpDialog, CondicaoPagamentoHelpDialog,
	ContaContabilHelpDialog, ContratoCompraHelpDialog, NaturezaOperacaoHelpDialog, ParceiroNegocioHelpDialog,
	ProdutoHelpDialog, TipoDocumentoHelpDialog, Session) {
	"use strict";

	return Controller.extend("br.com.idxtecDocumentoEntrada.controller.DocumentoEntradaEdit", {
		onInit: function(){
			var that = this;
			var oView = this.getView();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute( "documentoEntradaEdit" ).attachMatched( this._routerMatch , this );
			
			oView.addStyleClass( this.getOwnerComponent().getContentDensityClass() );
			
			var oModel = this.getModel();
			oModel.attachBatchRequestCompleted(function (){
				
				that.showFormFragment( "DocumentoEntradaCampos" ).then(function (){
					oView.setBusy( false ); 
				});
			});
		},
		
		onBeforeRendering: function(){
			var oModel = this.getModel();
			var oView = this.getView();
			
			oView.setBusyIndicatorDelay(0);
			oModel.attachBatchRequestSent( function(){
				oView.setBusy( true ); 
			} );
		},
		
		getModel : function( sModel ) {
			return this.getOwnerComponent().getModel( sModel );	
		},
		
		handleSearchCentro : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			CentroCustoHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchCfop : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			CfopHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchCondicao : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			CondicaoPagamentoHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchConta : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			ContaContabilHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchContrato : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			ContratoCompraHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchNatureza : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			NaturezaOperacaoHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchParceiro : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			ParceiroNegocioHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchProduto : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			ProdutoHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		handleSearchTipo : function( oEvent ){
			var sInputId = oEvent.getParameter( "id" );
			TipoDocumentoHelpDialog.handleValueHelp( this.getView(), sInputId, this );
		},
		
		_routerMatch: function(oEvent) {
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Editar Documento"
			});
			
			var sDocumento = oEvent.getParameter("arguments").documento;
			var iDocumentoId = parseInt( sDocumento, 0 );
			
			var oCompareModel = new JSONModel();
			var oDocumentoModel = new JSONModel();
			var oDocumentoItensModel = new JSONModel();
			var oModel = this.getModel();
			
			var sPathDocumento = "/DocumentoEntradas(" + iDocumentoId + ")";
			var sPathDocumentoItens = "/DocumentoEntradaItenss";
			
			oModel.read(sPathDocumento, {
				success: function(oQuadro){
					oDocumentoModel.setData(oQuadro);
				}
			});
			
			oModel.read(sPathDocumentoItens,{
				filters: [
					new sap.ui.model.Filter({
						path: 'DocumentoEntrada',
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sDocumento
					})
				],
			
				success: function(oData) {
					oCompareModel.setData(oData.results);
					oDocumentoItensModel.setData(oData.results);
				}
				
			});
			
			this.getView().setModel(oCompareModel, "compare"); 
			this.getView().setModel(oDocumentoModel, "documento");
			this.getView().setModel(oDocumentoItensModel, "itens");
		},
		
		onInserirLinha : function( oEvent ) {
			var oDocumentoModel = this.getView().getModel( "documento" );
			var oDocumentoItensModel = this.getView().getModel( "itens" );
			var oItems = oDocumentoItensModel.getProperty( "/" );
			
			var iDocumentoId = oDocumentoModel.getProperty("/Id");
			var iEmpresaId = Session.get( "EMPRESA_ID" );
			var iUsuarioId = Session.get( "USUARIO_ID" );
			
			var sPathDocumento = "/DocumentoEntradas(" + iDocumentoId + ")";
			var sPathEmpresas = "/Empresas(" + iEmpresaId + ")";
			var sPathUsuarios = "/Usuarios(" + iUsuarioId + ")";
			
			var oNovoItem = oItems.concat({
				Id: 0,
				DocumentoEntrada: iDocumentoId,
				DocumentoEntradaDetails: { __metadata: { uri: sPathDocumento } },
	    		Natureza: "",
				ContaContabil: "",
				CentroCusto: 0,
				Cfop: "",
				Produto: 0,
				Quantidade: 0.00,
				ValorUnitario: 0.00,
				Total: 0.00,
				Empresa: iEmpresaId,
				EmpresaDetails: { __metadata: { uri: sPathEmpresas } },
				Usuario: iUsuarioId,
				UsuarioDetails: { __metadata: { uri: sPathUsuarios } }
	    });
			
			this.getView().getModel( "itens" ).setProperty( "/", oNovoItem );
		},
		
		onRemoverLinha : function( oEvent ){
			var oDocumentoItensModel = this.getView().getModel( "itens" );
			
			var oTable = this.getView().byId( "tableDocumentoItens" );

			var nIndex = oTable.getSelectedIndex();
			var oModel = this.getModel();
			
			if (nIndex > -1) {
				var oContext = oTable.getContextByIndex(nIndex);
				var oDados = oContext.getObject();
				var oItems = oDocumentoItensModel.getProperty("/");
				
				if (oDados.Id !== 0) {
					oModel.remove(`/DocumentoEntradaItenss(${oDados.Id})`, {
						groupId: "upd"
					});
				}
				
				oItems.splice(nIndex,1);
				oDocumentoItensModel.setProperty("/", oItems);
				oTable.clearSelection();
			} else {
				sap.m.MessageBox.warning("Selecione um item na tabela!");
			}
		},
		
		salvar: function() {
			var that = this;
			var soma = 0;
			var oDocumentoModel = this.getView().getModel("documento");
			var oDocumentoItensModel = this.getView().getModel("itens");
			var oModel = this.getModel();
			
			var oDadosDocumento = oDocumentoModel.getData();
			var oDadosItens = oDocumentoItensModel.getData();
			
			if(this._verificaCabecalho( this.getView(), oDadosItens )){
				return;
			}
			
			if(this._verificaLinhas( oDadosItens )){
				return;
			}
			
			oModel.setDeferredGroups(["upd"]);
			
			var mParameters = { groupId: "upd" };
			
			this._getDadosCabecalho(oModel, oDadosDocumento, mParameters);
			this._getDadosLinhas(oModel, oDadosItens, mParameters);

			oModel.submitChanges({
				groupId: "upd",
				success: function(oResponse) {
					//se a propriedade response não for undefined, temos erro de gravação
					var erro = oResponse.__batchResponses[0].response;
					if (!erro) {
						sap.m.MessageBox.success("Documento de Entrada alterado com sucesso!",{
							onClose: function() {
								that.navBack();
							}
						});
					}
				}
			});
		},
		
		_getDadosCabecalho: function(oModel, oDadosDocumento, mParameters){
			
			oDadosDocumento.CondicaoPagamento = oDadosDocumento.CondicaoPagamento ? oDadosDocumento.CondicaoPagamento : 0;
			
			var iDocumentoId = oDadosDocumento.Id;
			
			var sPathTipo = "/TipoDocumentos(" + oDadosDocumento.Tipo + ")";
			var sPathParceiro = "/ParceiroNegocios(" + oDadosDocumento.Parceiro + ")";
			var sPathContrato = "/ContratoCompras('" + oDadosDocumento.ContratoCompra + "')";
			var sPathCondicao = "/CondicaoPagamentos(" + oDadosDocumento.CondicaoPagamento + ")";
			var sPathDocumento = "/DocumentoEntradas(" + iDocumentoId + ")";

			oDadosDocumento.TipoDocumentoDetails = { __metadata: { uri: sPathTipo } };
			oDadosDocumento.ParceiroNegocioDetails = { __metadata: { uri: sPathParceiro } };
			oDadosDocumento.ContratoCompraDetails = { __metadata: { uri: sPathContrato } };
			oDadosDocumento.CondicaoPagamentoDetails = { __metadata: { uri: sPathCondicao } };
			
			oModel.update(sPathDocumento, oDadosDocumento, mParameters);
		},
		
		_getDadosLinhas: function(oModel, oDadosItens, mParameters){
			for (var i = 0; i < oDadosItens.length; i++) {
				
				oDadosItens[i].CentroCusto = oDadosItens[i].CentroCusto ? oDadosItens[i].CentroCusto : 0;
				
				var iItemId = oDadosItens[i].Id;
				var iDocumentoId = oDadosItens[i].Documento;
				var iNaturezaId = oDadosItens[i].Natureza;
				var iContaContabilId = oDadosItens[i].ContaContabil;
				var iCentroCustoId = oDadosItens[i].CentroCusto;
				var iCfopId = oDadosItens[i].Cfop;
				var iProdutoId = oDadosItens[i].Produto;

				var sDocumentoPath = "/DocumentoEntradas(" + iDocumentoId + ")";
				var sPathNatureza = "/NaturezaOperacaos('" + iNaturezaId + "')";
				var sPathContaContabil = "/PlanoContas('" + iContaContabilId + "')";
				var sPathCentroCusto = "/CentroCustos(" + iCentroCustoId + ")";
				var sPathCfop = "/Cfops('" + iCfopId + "')";
				var sPathProduto = "/Produtos(" + iProdutoId + ")";
				var sPathDocumentoItens = "/DocumentoEntradaItenss";

				
				oDadosItens[i].NaturezaOperacaoDetails = { __metadata: { uri: sPathNatureza } };
				oDadosItens[i].PlanoContaDetails = { __metadata: { uri: sPathContaContabil } };
				oDadosItens[i].CentroCustoDetails = { __metadata: { uri: sPathCentroCusto } };
				oDadosItens[i].CfopDetails = { __metadata: { uri: sPathCfop } };
				oDadosItens[i].ProdutoDetails = { __metadata: { uri: sPathProduto } };
				
				if (iItemId === 0){
					oModel.create(sPathDocumentoItens, oDadosItens[i], mParameters);
				} else {
					sPathDocumentoItens = "/DocumentoEntradaItenss(" + iItemId + ")";
					oModel.update(sPathDocumentoItens, oDadosItens[i], mParameters);
				}
			}
		},
		
		onCalculaTotal : function( oEvent ) {
			var oDocumentoItensModel = this.getView().getModel( "itens" );
			var aItems = oDocumentoItensModel.getData();
			
			for( var i = 0; i < aItems.length; i++ ) {
				aItems[i].Total = aItems[i].Quantidade * aItems[i].ValorUnitario;                                                  
			}
	
			oDocumentoItensModel.refresh( true );
			this._totalPedido();
		},
		
		_totalPedido : function() {
			var oDocumentoItensModel = this.getView().getModel( "itens" );
			var aItems = oDocumentoItensModel.getData();
			var nTotal = 0;
			
			for( var i = 0; i < aItems.length; i++) {
				nTotal += aItems[i].Total;
			}

			this.getView().getModel( "documento" ).setProperty( "/Total", nTotal );
			
		},
		
		navBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter.navTo("documentoEntradaLista", {}, true);
			}
		},
		
		_getFormFragment: function (sFragmentName) {
			if (this._formFragment) {
				return this._formFragment;
			}
		
			this._formFragment = sap.ui.xmlfragment(this.getView().getId(),`br.com.idxtecDocumentoEntrada.view.${sFragmentName}`, this);

			return this._formFragment;
		},

		showFormFragment : function (sFragmentName) {
			var that = this;
			return new Promise(function (resolve){
				var oPage = that.getView().byId("pageDocumentoEntradaEdit");
				oPage.removeAllContent();
				oPage.insertContent(that._getFormFragment(sFragmentName), 0);
				resolve();
			});
		},
		
		fechar: function (oEvent) {
			var that = this;
			var oCompareModel = this.getView().getModel("compare");
			var oDocumentoItensModel = this.getView().getModel("itens");
			
			var oDadosCompare = oCompareModel.getData();
			var oDadosItens = oDocumentoItensModel.getData();
			
			if(oDadosCompare.length !== oDadosItens.length){
				sap.m.MessageBox.confirm("Todas as informações serão descartadas, deseja continuar?", {
					onClose: function(sResposta){
						if(sResposta === "OK"){
							that.navBack();
						}
					}
				});
			} else{
				this.navBack();
			}
		},
		
		_verificaCabecalho : function( oView, oDadosItens ){
			if(oView.byId("tipo").getValue() === "" || oView.byId("parceiro").getValue() === ""
			|| oView.byId("emissao").getDateValue() === ""){
				MessageBox.warning("Preencha todos os campos!");
				return true;
			} else if(oDadosItens.length === 0) {
				MessageBox.warning("Documento não possui itens.");
				return true; 
			} 
		},
		
		_verificaLinhas : function( oDadosItens ){
			for( var i=0; i<oDadosItens.length; i++ ){
				if(oDadosItens[i].Natureza === "" || oDadosItens[i].Produto === 0){
					MessageBox.warning("Preencha todos os campos obrigatórios!");
					return true;
				}
			}
		}
	});
});