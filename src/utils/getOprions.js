module.exports  = (body)=>({
     filters : body.filters ? body.filters : {},
   only : body.only ? body.only : {},
   sort : body.sort ? body.sort : {},
   limit : body.limit ? body.limit : 0,
   skip : body.skip ? body.skip : 0,
})