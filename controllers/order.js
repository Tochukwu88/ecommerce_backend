exports.create = (req,res) =>{
    const donations = [
        {amount:100,amount:200,amount:300
            
        }
    ]
    const dd = donations.map((a,i)=>{
        return (
            console.log(a.amount * 2)
        )
    })
}