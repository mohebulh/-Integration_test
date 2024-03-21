module.exports = (app, db) => {
    app.get("/language", (req, res) => {
        const {languageName} =req.query;
        // Define the SQL query to get the number of speakers for each language and their percentage of the world population
        let sql = `
            SELECT 
                Language, 
                SUM(Population) AS TotalSpeakers, 
                SUM(Population) / (SELECT SUM(Population) FROM country) * 100 AS PercentageOfWorldPopulation
            FROM 
                countrylanguage
            WHERE 
                Language IN ('Chinese', 'English', 'Hindi', 'Spanish', 'Arabic')
            GROUP BY 
                Language
            ORDER BY 
                TotalSpeakers DESC;
        `;
        const params =[];

        //define sql query to search
        if (languageName){
            sql+=" AND countryLanguage.'Language' LIKE ?";
            params.push('%' + languageName + '%');
        }

        // Execute the query
        db.execute(sql, params, (err, results, fields) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server Error");
            } else {
                const formattedResults = results.map(language => ({
                    
                    Language: language.Language,
                    TotalSpeakers: Number(language.TotalSpeakers).toLocaleString(),
                    PercentageOfWorldPopulation: language.PercentageOfWorldPopulation.toFixed(2) + '%'
                }));

                res.render("language", { languages: formattedResults });
            }
        });
    });
};
