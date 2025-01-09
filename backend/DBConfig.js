import pkg from 'pg';
const {Pool} = pkg;
// const itemsPool = new Pool({
//     //connectionString: "postgres://resumeparser:wvntrLJr2zgcuHuO35kCxoL8BlYdTutb@dpg-co3f4la1hbls73f0r7fg-a.singapore-postgres.render.com/resumeparserdb",
//     connectionString: 
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

const itemsPool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  });

  const query = async (text, params) => {
    const client = await itemsPool.connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
  };

export default {itemsPool, query};
