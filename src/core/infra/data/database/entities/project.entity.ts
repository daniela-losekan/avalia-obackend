import {
    Entity,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    Column,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    OneToOne
} from "typeorm";
import { v4 as uuid } from 'uuid';
import { UserEntity } from "./user.entity";
import { ProjectsRateEntity } from "./projects-rate.entity";
import { TaskEntity } from "./task.entity";

@Entity({name: 'projects'})
export class ProjectEntity extends BaseEntity {
    @PrimaryColumn()
    uid!: string;

    @Column({name: 'user_uid'})
    userUid!: string;
    
    @Column()
    name!: string;

    @Column()
    description?: string;

    @Column({name: 'start_at'})
    startAt?: Date;

    @Column({name: 'finish_at'})
    finishAt?: Date;

    @Column({name: 'created_at'})
    createdAt!: Date;

    @Column({name: 'updated_at'})
    updatedAt!: Date;

    @ManyToOne(_ => UserEntity, user => user.projects)
    @JoinColumn({name: 'user_uid', referencedColumnName: 'uid'})
    user!: UserEntity;

    @OneToOne(_ => ProjectsRateEntity, projectRate => projectRate.user)
    projectRate?: ProjectsRateEntity

    @OneToMany(_ => TaskEntity, task => task.project)
    tasks?: TaskEntity[];

    @BeforeInsert()
    private beforeInsert() {
        this.uid = uuid();
        this.createdAt = new Date(Date.now());
        this.updatedAt = new Date(Date.now());
    }

    @BeforeUpdate()
    private beforeUpdate() {
        this.updatedAt = new Date(Date.now());
    }
}
