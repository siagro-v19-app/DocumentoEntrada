sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
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
], function(Controller, MessageBox, JSONModel, CentroCustoHelpDialog, CfopHelpDialog, CondicaoPagamentoHelpDialog,
	ContaContabilHelpDialog, ContratoCompraHelpDialog, NaturezaOperacaoHelpDialog, ParceiroNegocioHelpDialog,
	ProdutoHelpDialog, TipoDocumentoHelpDialog, Session) {
	"use strict";

	return Controller.extend("br.com.idxtecDocumentoEntrada.controller.DocumentoEntradaAdd", {
		onInit: function(){
			var oView = this.getView();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute( "documentoEntradaAdd" ).attachMatched( this._routerMatch , this );
			
			oView.addStyleClass( this.getOwnerComponent().getContentDensityClass() );
				
			this.showFormFragment( "DocumentoEntradaCampos" );
		},
		
		getModel : function( sModel ) {
			return this.getOwnerComponent().getModel( sModel );	
		},
		
		handleSearchCentro: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CentroCustoHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchCfop: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CfopHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchCondicao: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CondicaoPagamentoHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchConta: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			ContaContabilHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchContrato: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			ContratoCompraHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchNatureza: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			NaturezaOperacaoHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchParceiro: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			ParceiroNegocioHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchProduto: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			ProdutoHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchTipo: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			TipoDocumentoHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		_routerMatch: function(oEvent) {
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Inserir Documento"
			});
	
			var oDocumentoModel = new JSONModel();
			var oDocumentoItensModel = new JSONModel();
			
			var iEmpresaId = Session.get("EMPRESA_ID");
			var iUsuarioId = Session.get("USUARIO_ID");
			
			var sPathEmpresas = "/Empresas(" + iEmpresaId + ")";
			var sPathUsuarios = "/Usuarios(" + iUsuarioId + ")";
			
			var oDocumento = {
				Id: 0,
				Tipo: 0,
				TipoDocumento: "BENEFICIAMENTO",
				TipoFormulario: "TERCEIROS",
				Parceiro: 0,
				Emissao: new Date(),
				Numero: "",
				Serie: "",
				NumeroNFProdutorRural: "",
				SerieNFProdutorRural: "",
				ContratoCompra: "",
				CondicaoPagamento: 0,
				ChaveAcesso: "",
				Frete: 0.00,
				Despesa: 0.00,
				Seguro: 0.00,
				Total: 0.00,
				Observacoes: "",
				InformacoesAdcionionais: "",
				Empresa: iEmpresaId,
				Usuario: iUsuarioId,
				EmpresaDetails: { __metadata: { uri: sPathEmpresas } },
				UsuarioDetails: { __metadata: { uri: sPathUsuarios } }
			};
			
			oDocumentoModel.setData(oDocumento);
			oDocumentoItensModel.setData([]);
			
			this.getView().setModel(oDocumentoModel, "documento");
			this.getView().setModel(oDocumentoItensModel, "itens");
			
			this.getView().byId("tipo").setValue(null);
			this.getView().byId("parceiro").setValue(null);
			this.getView().byId("contrato").setValue(null);
			this.getView().byId("condicao").setValue(null);
		},
		
		onInserirLinha: function(oEvent) {
			var oDocumentoItensModel = this.getView().getModel("itens");
			
			var oItems = oDocumentoItensModel.getProperty("/");
			
			var iEmpresaId = Session.get("EMPRESA_ID");
			var iUsuarioId = Session.get("USUARIO_ID");
			
			var sPathEmpresas = "/Empresas(" + iEmpresaId + ")";
			var sPathUsuarios = "/Usuarios(" + iUsuarioId + ")";
			
			var oNovoItem = oItems.concat({
				Id: 0,
	    		Natureza: "",
				ContaContabil: "",
				CentroCusto: 0,
				Cfop: "",
				Produto: 0,
				Quantidade: 0.00,
				ValorUnitario: 0.00,
				Total: 0.00,
				Empresa: iEmpresaId,
				Usuario: iUsuarioId,
				EmpresaDetails: { __metadata: { uri: sPathEmpresas } },
				UsuarioDetails: { __metadata: { uri: sPathUsuarios } }
	    });
			
			this.getView().getModel("itens").setProperty("/", oNovoItem);
		},
		
		onRemoverLinha: function(oEvent){
			var oDocumentoItensModel = this.getView().getModel("itens");
			
			var oTable = this.getView().byId("tableDocumentoItens");
			
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex > -1) {
				var oItems = oDocumentoItensModel.getProperty("/");
				
				oItems.splice(nIndex, 1);
				oDocumentoItensModel.setProperty("/", oItems);
				oTable.clearSelection();
			} else {
				sap.m.MessageBox.warning("Selecione um item na tabela!");
			}
		},
		
		salvar: function() {
			var that = this;
			var oDocumentoModel = this.getView().getModel("documento");
			var oDocumentoItensModel = this.getView().getModel("itens");
			var oModel = this.getModel();
			
			var oDadosDocumento = oDocumentoModel.getData();
			var oDadosItens = oDocumentoItensModel.getData();
			
			/*if(this._verificaCabecalho(this.getView(),oDadosDocumento,oDadosItens)){
				return;
			}
			
			if(this._verificaLinhas(oDadosVariedade, soma, oDadosDocumento.Area)){
				return;
			}*/
			
			var sPathTipo = "/TipoDocumentos(" + oDadosDocumento.Tipo + ")";
			var sPathParceiro = "/ParceiroNegocios(" + oDadosDocumento.Parceiro + ")";
			var sPathContrato = "/ContratoCompras('" + oDadosDocumento.ContratoCompra + "')";
			var sPathCondicao = "/CondicaoPagamentos(" + oDadosDocumento.CondicaoPagamento + ")";

			oDadosDocumento.TipoDocumentoDetails = { __metadata: { uri: sPathTipo } };
			oDadosDocumento.ParceiroNegocioDetails = { __metadata: { uri: sPathParceiro } };
			oDadosDocumento.ContratoCompraDetails = { __metadata: { uri: sPathContrato } };
			oDadosDocumento.CondicaoPagamentoDetails = { __metadata: { uri: sPathCondicao } };
			oDadosDocumento.DocumentoEntradaItensDetails = [];
		
			for ( var i = 0; i < oDadosItens.length; i++) {
				
				var iNaturezaId = oDadosItens[i].Natureza;
				var iContaContabilId = oDadosItens[i].ContaContabil;
				var iCentroCustoId = oDadosItens[i].CentroCusto;
				var iCfopId = oDadosItens[i].Cfop;
				var iProdutoId = oDadosItens[i].Produto;
				
				var sPathNatureza = "/NaturezaOperacaos('" + iNaturezaId + "')";
				var sPathContaContabil = "/PlanoContas('" + iContaContabilId + "')";
				var sPathCentroCusto = "/CentroCustos(" + iCentroCustoId + ")";
				var sPathCfop = "/Cfops('" + iCfopId + "')";
				var sPathProduto = "/Produtos(" + iProdutoId + ")";
				
				oDadosItens[i].NaturezaOperacaoDetails = { __metadata: { uri: sPathNatureza } };
				oDadosItens[i].PlanoContaDetails = { __metadata: { uri: sPathContaContabil } };
				oDadosItens[i].CentroCustoDetails = { __metadata: { uri: sPathCentroCusto } };
				oDadosItens[i].CfopDetails = { __metadata: { uri: sPathCfop } };
				oDadosItens[i].ProdutoDetails = { __metadata: { uri: sPathProduto } };

				oDadosDocumento.DocumentoEntradaItensDetails.push(oDadosItens[i]);
			}
			debugger;
			oModel.create("/DocumentoEntradas", oDadosDocumento, {
				success: function(){
					sap.m.MessageBox.success("Documento de Entrada inserido com sucesso!",{
						onClose: function() {
							that.navBack();
						}
					});
				}
			});
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
			var oPage = this.getView().byId("pageDocumentoEntradaAdd");
			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));
		},
		
		fechar: function(oEvent) {
			var oTable = this.getView().byId("tableDocumentoItens");
			var that = this;
			console.log(oTable.getBinding().getLength());
			if(oTable.getBinding().getLength() >= 1){
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
		}
	});
});