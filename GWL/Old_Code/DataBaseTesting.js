//   const a = async()=>{
  //     await ArtikelService.deleteAllData();
  //     await ArtikelService.createArtikel({
  //     gwId: "1123",
  //     firmenId: "123142",
  //     beschreibung: "Ich liebe Granaten",
  //     menge: 123,
  //     mindestMenge: 2,
  //     kunde: "HalloGMBH",
  //     ablaufdatum: Date.now()
  //   })
  //   //  console.log(await ArtikelService.getArtikelById("1123"));
  //    await ArtikelService.updateArtikel("1123", {  
  //     gwId: "1123",
  //     firmenId: "123142",
  //     beschreibung: "Ich liebe Äpfel",
  //     menge: 123,
  //     mindestMenge: 2,
  //     kunde: "HalloGMBH",
  //     ablaufdatum: Date.now()})
  //   //  console.log("................................");
  //   //  console.log(await ArtikelService.getArtikelById("1123"));
  //   //  console.log("................................");
  //   //  await ArtikelService.deleteArtikel("1123");
  //   //  console.log(await ArtikelService.getArtikelById("1123"));
  //   await RegalService.createRegal({
  //     regalId: "123",
  //     fachName: "456",
  //     regalName: "Ich liebe Bomben",
  //   })
  //   //  console.log(await RegalService.getAllRegal());
  //    await RegalService.updateRegal("123", {  
  //     regalId: "123",
  //     fachName: "456",
  //     regalName: "Ich liebe Xelophone",
  //   })
  //   // console.log("................................");
  //   // console.log(await RegalService.getAllRegal());
  //   // await RegalService.deleteRegal("123");
  //   // console.log(await RegalService.getAllRegal());
  //   await LogService.createLog({
  //     beschreibung: "Ich Liebe Endo Plasmatische Zellen oder so",
  //     menge: 4,
  //   }, "1123","123")
  //   await LogService.createLog({
  //     beschreibung: "Ich Liebe Endo Plasmatische Zellen oder so",
  //     menge: 4000,
  //   }, "134","123")
  //   console.log(await LogService.getAllLogs());
  //   console.log("................................");
  //   console.log(await LogService.getLogByArtikelId("1123"));
  //   console.log("................................");
  //   console.log(await LogService.getLogByRegalId("123"));
  //   console.log("................................");
  //   const logs = await LogService.getLogByRegalIdAndArtikelId("123","1123")
  //   console.log(logs.regalLogs)
  //   console.log(logs.artikelLogs)
  //   console.log("................................");

  //   await LogService.deleteLogByRegalIdAndArtikelId("123","1123");
  //   console.log(await LogService.getAllLogs());
  // }
  // a();

  //-------------------------------------------------------------------------------------------------------