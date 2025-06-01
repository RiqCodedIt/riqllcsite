// Services Types

export interface Service {
  service_id: string;
  name: string;
  price: number;
  description: string;
  category: 'mixing' | 'mastering' | 'combo' | 'other';
  features: string[];
  delivery_info: {
    revisions: number;
    delivery_times: {
      one_song: string;
      five_songs: string;
      ten_songs: string;
    };
    delivery_policy: string[];
  };
  how_to_send: {
    instructions: string;
    supported_daws: string[];
  };
}

export interface ServiceCartItem {
  type: 'service';
  service_id: string;
  service_name: string;
  price: number;
  category: string;
}

export interface ServicesData {
  services: Service[];
}
