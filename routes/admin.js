const express = require("express")
const router = express.Router();
const mongoose= require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")
router.get('/', (req, res) => {
   // res.send("Pagina principal do ADM")
   res.render("admin/index")
})

router.get('/posts', eAdmin, (req, res) => {
    res.send("pagina de posts")
})


router.get('/categorias', eAdmin, (req, res) => {
   // res.send("pagina de categorias")
   Categoria.find().sort({date: "desc"}).then((categorias)=>{
      res.render("admin/categorias", {categorias: categorias})

   }).catch((err) => {
      req.flash("error_msg","Erro ao listar categorias")
      res.redirect("/admin")
   })

//   res.render("admin/addcategorias")
})

router.get('/categorias/add', eAdmin, (req, res) => {
   // res.send("pagina de categorias")

   res.render("admin/addcategorias")
})


router.post('/categorias/nova', eAdmin, (req, res) => {

   var erros = []

   if (!req.body.nome||typeof req.body.nome==undefined||req.body.nome==null){
      erros.push({texto: "nome invalido"})
   }

   if (!req.body.slug||typeof req.body.slug==undefined||req.body.slug==null){
      erros.push({texto: "slug invalido"})
   }
   if (req.body.nome.length<2) {
      erros.push({texto: "nome da categoria muito pequeno"})
   }

   if(erros.length>0) {
      res.render("admin/addcategorias", {erros: erros})
   }
   else {
      const novaCategoria = {
         nome: req.body.nome,
         slug: req.body.slug
      }
      new Categoria(novaCategoria).save().then(()=> {
         console.log("Categoria salva con sucesso!")
         req.flash("success_msg","Categoria salva com sucesso")
         res.redirect("/admin/categorias")
      }).catch((err) => {
         req.flash("error_msg", "Erro ao salvar a categoria")
         console.log("Erro ao salvar categoria"+err)
   
      })
   }
   })

router.get("/categorias/edit/:id", eAdmin, (req,res) =>{
//   res.send("Pagina de edicao da categoria")
Categoria.findOne({_id: req.params.id}).then((categoria)=> {
   res.render("admin/editcategorias", {categoria: categoria})
   }).catch((err) => {
      req.flash("error_msg","Esta categoria nao existe")
      res.redirect("/admin/categorias")
   })
})



router.post("/categorias/edit", eAdmin, (req,res) =>{
   Categoria.findOne({_id: req.body.id}).then((categoria)=> {
     // res.render("admin/editcategorias", {categoria: categoria})
      categoria.nome = req.body.nome
      categoria.slug= req.body.slug
      categoria.save().then(()=> {
         req.flash("success_msg","Editado com sucesso")
         res.redirect("/admin/categorias")
      }).catch((err) =>{
         req.flash("error_msg", "erro ao editar")
         res.redirect("/admin/categorias")
      })


      }).catch((err) => {
         req.flash("error_msg","Esta categoria nao existe")
         res.redirect("/admin/categorias")
      })
   })
   


   router.post("/categorias/deletar", eAdmin, (req,res) =>{
      Categoria.remove({_id: req.body.id}).then((categoria)=> {
         req.flash("success_msg","Categoria deletada com sucesso")
         res.redirect("/admin/categorias")
      }).catch((err) =>{
         req.flash("error_msg","erro ao deletar")
         res.redirect("/admin/categorias")
      })
   })


   router.get("/postagens",  eAdmin, (req,res) => {
         //res.render("admin/postagens")
         Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
            res.render("admin/postagens", {postagens: postagens} )
         }).catch((err) =>{
            req.flash("error_msg","Houve erro ao lista postagens")
            res.redirect("/admin")
         })
      })
      
   router.get("/postagens/add", eAdmin, (req,res) => {
      Categoria.find().then((categorias) =>{
         res.render("admin/addpostagem", {categorias: categorias})
      }).catch((err) =>{
         req.flash("error_msg", "Erro ao enviar categoria")
         res.redirect("/admin")
      })
      })

      router.post("/postagens/nova",  eAdmin, (req,res) =>{
         var erros = []
         if (req.body.categoria=="0"){
            erros.push({texto: "Categoria invalida, registre uma categoria"})
         }
         if (erros.length>0) {
            res.render("/admin/addpostagens", {erros: erros})
         } else {
            const novaPostagem = {
               titulo: req.body.titulo,
               descricao: req.body.descricao,
               conteudo: req.body.conteudo,
               categoria: req.body.categoria,
               slug: req.body.slug
            }
            new Postagem(novaPostagem).save().then(() =>{
               req.flash("success_msg", "Postagem criada com sucesso")
               res.redirect("/admin/postagens")
            }).catch((err) => {
               req.flash("error_msg", "erro salvando postagem")
               res.redirect("/admin/postagens")
            })

      }
      })
   
      router.get("/postagens/edit/:id",  eAdmin, (req,res) =>{
         //   res.send("Pagina de edicao da categoria")
         Postagem.findOne({_id: req.params.id}).then((postagem)=> {
            Categoria.find().then((categorias) => {
               res.render("admin/editpostagens", {postagem: postagem, categorias: categorias})
         }).catch((err) => {
            req.flash("error_msg","Erro ao listarcategorias")
            res.redirect("/admin/postagens")
         })
         }).catch((err) => {
               req.flash("error_msg","Erro ao carregar formulario de postagens")
               res.redirect("/admin/postagens")
            })
         })
         
     
         router.post("/postagem/edit",  eAdmin, (req,res) =>{
            Postagem.findOne({_id: req.body.id}).then((postagem) => {
               postagem.titulo= req.body.titulo
               postagem.descricao= req.body.descricao
               postagem.conteudo=req.body.conteudo
               postagem.categoria= req.body.categoria
               postagem.slug=req.body.slug

               postagem.save().then(() => {
                  req.flash("success_msg","Postagem salva com sucesso")
                  res.redirect("/admin/postagens")  
               }).catch((err) => {
                  req.flash("error_msg","Erro ao salvar postagens")
                  res.redirect("/admin/postagens")
               })


            }).catch((err) => {
               req.flash("error_msg","Erro ao salvar formulario de postagens")
               res.redirect("/admin/postagens")
            })
         })         


         router.get("/postagens/deletar/:id", eAdmin, (req,res) =>{
            Postagem.remove({_id: req.params.id}).then(()=> {
               req.flash("success_msg","Postagen deletada com sucesso")
               res.redirect("/admin/postagens")
            }).catch((err) =>{
               req.flash("error_msg","erro ao deletar")
               res.redirect("/admin/postagens")
            })
         })
      

module.exports = router