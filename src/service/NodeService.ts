import axios from 'axios';

export class NodeService {
    static getTreeTableNodes() {
      throw new Error('Method not implemented.');
    }
    getTreeTableNodes() {
        return axios.get('path/to/your/api/endpoint')
            .then(res => res.data)
            .catch(error => {
                console.error("There was an error retrieving the data!", error);
                return [];
            });
    }
}
