require 'sequel'

Sequel.migration do
  up do
    create_table(:availability) do
      primary_key :id
      Date :date, null: false
      String :studio_id, size: 1, null: false  # 'C' or 'D'
      String :time_slot_id, size: 20, null: false  # 'morning', 'afternoon', 'evening'
      TrueClass :available, null: false
      String :source, size: 20, default: 'recordco'  # 'recordco' or 'manual'
      DateTime :last_updated, default: Sequel::CURRENT_TIMESTAMP
      String :sync_status, size: 20, default: 'synced'
      
      index [:date, :studio_id, :time_slot_id], unique: true
      index :last_updated
    end
    
    create_table(:sync_logs) do
      primary_key :id
      DateTime :sync_time, default: Sequel::CURRENT_TIMESTAMP
      String :status, size: 20, null: false  # 'success', 'error', 'partial'
      Integer :records_updated, default: 0
      Text :errors
      Text :details
      
      index :sync_time
      index :status
    end
  end
  
  down do
    drop_table(:sync_logs)
    drop_table(:availability)
  end
end
