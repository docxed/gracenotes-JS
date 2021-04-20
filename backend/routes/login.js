const express = require("express");
const path = require("path")
const pool = require("../config");

router = express.Router();

// coding here !!
router.post("/login", async function(req, res, next){
    const user = req.body.form.user
    const pass = req.body.form.pass
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        let [rows, _] = await conn.query("SELECT * FROM members WHERE member_user = ? AND member_password = ?", [user, pass])

        if (rows.length > 0){
            res.json({message: 'Login สำเร็จ', status: true, ses_user: user, ses_id: rows[0].member_id, ses_level: rows[0].member_level})
        }else{
            await conn.rollback();
            return res.json({message: 'รหัสนักเรียน หรือ รหัสผ่านไม่ถูกต้อง, โปรดลองอีกครั้ง', status: false})
        }
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        return res.status(400).json(err);
    } finally {
        conn.release();
    }
})

exports.router = router;