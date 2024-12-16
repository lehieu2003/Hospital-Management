module.exports = {
    hopital: {
        input: 'http://localhost:5265/swagger/v1/swagger.json',
        output: {
            mode: 'split',
            target: './src/services/api/index.ts',
            schemas: './src/types', 
            client: 'react-query',
            prettier: true,
            clean: true,
        }
    }
};